<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Http;

use Illuminate\Http\Request;
use  App\Models\checklist;
use Illuminate\Support\Facades\Hash;
use App\Models\standard;
use App\Models\company;

use Illuminate\Support\Facades\Storage;

class migrationController extends Controller
{
    //
    function getCklist(){

        checklist::truncate();
        $response = Http::get('http://ec2-54-169-201-41.ap-southeast-1.compute.amazonaws.com/qcmsv2/getcklist3')->json();
      
         foreach ($response as $schm) {
        //     $item = Http::get('http://ec2-54-169-201-41.ap-southeast-1.compute.amazonaws.com/qcmsv2/getcklist2', [
        //         'checklistID' => $schm['checklistID'],
        //         'uuid'=>'qad123'
        //     ]);

        //     $cklist = (object)[];
        //     $cklist->version=$schm['schemeVersion'];
        //     $cklist->lastUpdate=$schm['schemeUpdDate'];
        //     $cklist->category=$schm['ctglist'];
        //     $cklist->severity=$schm['severities'];
        //     $cklist->data=$item->json();
        //     $cklist->name=trim($schm['schemeName']);

                $cklist = checklist::firstOrNew(['cklistName' =>  trim($schm['name'])]);

                if($cklist->cklistData){
                    $exist=json_decode($cklist->cklistData);
                    array_push($exist,$schm);
                    $cklist->cklistData = json_encode($exist);}
                else{
                    $cklist->cklistData = json_encode(array($schm));
                }
                $cklist->save();
                
        //     $usr = new checklist;
        //     $usr->cklistName = trim($schm['schemeName']);
        //     $usr->cklistLang = trim($schm['schemeLang']);
        //     $usr->cklistData = json_encode(array($cklist));
        //     $usr->save();
         }
        
        return response()->json($cklist);

    }

    function addProfile(){
        $myObj=(object)array(array('id'=>1));

        $myObj2=(object)array();
        $usr = new profile;
        $usr->name = "Holistics Lab Sdn Bhd";
        $usr->users = json_encode($myObj);
        $usr->careers = json_encode($myObj2);
      //  $usr->save();
        return response()->json($usr);
    }

    function addcompany(){

        $users= profile::where('profilePK', '>', 5)->select('profilePK as id','name')->get();
        $myObj=(object)array(
            "address"=>"Level 6, Bangunan TH, Damansara Uptown 3, No. 3, Jalan SS21/39, 47400 Petaling Jaya, Selangor Darul Ehsan.",
            $users
        );

        $usr = new company;
        $usr->cmpnyName = "Gerbang Alaf Restaurants Sdn Bhd";
        $usr->cmpnyDetails = json_encode($myObj);
       // $usr->save();
        return response()->json($usr);
    }

    function updateCompany(){
        // $cmpny= company::get();
        // foreach ($cmpny as $c) {
        //     $usr;
        //     if($c == "1"){
        //         $usr = profile::where('profilePK', '<', 6)->select('profilePK as id','name')->get();
        //     }
        //     else{
        //         $usr = profile::where('profilePK', '>', 5)->select('profilePK as id','name')->get();
        //     }
        //     $c->cmpnyStaff =json_encode($usr) ;
        //    // $c->save();
        // }

    }

    function updateUser(){

        // $users= company::where('cmpnyPK', '=', 2)->select('cmpnyPK as id','cmpnyName')->get();
      
        // $usr = profile::where('profilePK', '>', 5)->get();
        // foreach ($usr as $lalala) {
        //     $lalala->careers =json_encode($users) ;
        //    // $lalala->save();
        // }
      
        // return response()->json($usr);
    }

    function getStandard(){


        $response = file_get_contents('http://ec2-54-169-201-41.ap-southeast-1.compute.amazonaws.com/qcmsv2/getstandard');
        $data = json_decode($response);
        foreach ($data as $std) {
           
        //     $item = Http::get('http://ec2-54-169-201-41.ap-southeast-1.compute.amazonaws.com/qcmsv2/getcklist2', [
        //         'checklistID' => $schm['checklistID'],
        //         'uuid'=>'qad123'
        //     ]);

        //     $cklist = (object)[];
        //     $cklist->version=$schm['schemeVersion'];
        //     $cklist->createdAt=$schm['schemeUpdDate'];
        //     $cklist->category=$schm['ctglist'];
        //     $cklist->severity=$schm['severities'];
        //     $cklist->data=$item->json();

            $standard = new standard;
            $standard->code = $std->code;
            $standard->name = $std->name;
            $standard->lang = $std->lang;
            $standard->data = json_encode($std->data);
           //s $standard->save();
        }
        return response()->json($standard);

    }

    function migrateMCD(){
        
        $response = file_get_contents('http://ec2-54-169-201-41.ap-southeast-1.compute.amazonaws.com/qcmsv2/checklogin2?username=rosedalina&password=rose@mcd2019&lang=ms&uuid=qad123');
        $data = json_decode($response);
        $prms= (object)[];
        foreach ($data->premise as $p) {

            $prms->{trim($p->prmsCode)}=(object)['name'=>trim($p->prmsName),'address'=>trim($p->prmsAddrs)];
        }
        $cmpny= company::where('cmpnyname', $data->companyName)->first();
        // dd($cmpny);
        $id=dechex($cmpny->cmpnyPK);

        Storage::put($id.'\data\prms', $this->encodeMaster($prms));
        dd($prms);
        
    }

    function encodeMaster( $obj ) 
    { 
    return base64_encode(gzcompress(serialize($obj))); 
    } 

    //function to unserialize the serialized text
    function unencodeMaster($txt) 
    { 
    return unserialize(gzuncompress(base64_decode($txt))); 
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use  App\Models\company;
use  App\Models\User;

class companyController extends Controller
{
    //
    function getAllCompany(){
        
        $cmpny= company::get();
        foreach ($cmpny as $c) {
            $c->cmpnyDetails=json_decode($c->cmpnyDetails);
            $c->cmpnyConfig=json_decode($c->cmpnyConfig);
            // $c->cmpnyPK=encrypt($c->cmpnyPK);
        }
        return response()->json($cmpny);
    }

    function getStaffCompany($id){
        // $id=decrypt($id);

        $usr= User::where('cmpnyFK',$id)->get();
        // foreach ($cmpny as $c) {
        //     $c->cmpnyDetails=json_decode($c->cmpnyDetails);
        //     $c->cmpnyPK=encrypt($c->cmpnyPK);
        // }
        return response()->json($usr);
    }

    function updCompany(Request $request){
        if($request->cmpnyPK){
            $cmpny= company::where('cmpnyPK',$request->cmpnyPK)->first();
        }
        else{
            $cmpny = new company;
        }
        
        $cmpny->cmpnyName=$request->cmpnyName;
        $cmpny->cmpnyDetails=json_encode($request->cmpnyDetails);
        $cmpny->cmpnyLink=$request->cmpnyLink;
        $cmpny->cmpnyConfig=json_encode($request->cmpnyConfig);
        $cmpny->save();
        
        $cmpny->cmpnyDetails=$request->cmpnyDetails;
        $cmpny->cmpnyConfig=$request->cmpnyConfig;
        return response()->json($cmpny);
    }
}

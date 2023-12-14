<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use  App\Models\subscription;
use  App\Models\user;
use  App\Models\checklist;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class checklistController extends Controller
{
    //
    function getAllCklist(){
        $cklist= checklist::select('cklistName','cklistPK as id')->get();
        foreach ($cklist as $c) {
            $c->id=encrypt($c->id);
        }
        return response()->json($cklist);
    }
    function getCklist($id){
        $id=decrypt($id);
        $cklist= checklist::select('cklistName','cklistData','cklistLang')->where('cklistPK',$id)->first();
        $cklist->id=encrypt($id);
        $cklist->cklistData=json_decode($cklist->cklistData);
        return response()->json($cklist);
    }
    function savecklist(Request $request){
        $schm=$request->data;
        
        $cklist = checklist::firstOrNew(['cklistName' =>  trim($schm['name']."_backup")]);


                if($cklist->cklistData){
                    $exist=json_decode($cklist->cklistData);
                    array_push($exist,$schm);
                    $cklist->cklistData = json_encode($exist);}
                else{
                    $cklist->cklistData = json_encode(array($schm));
                }
                $cklist->save();
        return response()->json($request->data["name"]);
    }

    function postScheme(Request $request){

        // return response()->json($request);
        if ($request->has('id')) {
            $id=decrypt($request->id);
            $scheme= checklist::where("cklistPK",$id)->first();
            $data=json_decode($scheme->cklistData);

            $newCklist=(object)$request->data;

            if($request->has('action') && $request->action=="rename"){
                $scheme->cklistName=$request->name;
                $scheme->save();
                return response()->json(true);
            }
            if($request->has('idx')&& $request->idx!=="draft"){
                $key=$request->idx;

                if($request->action=="delete"){
                    array_splice($data, $key, 1);
                    
                    $scheme->cklistData=json_encode($data);
                    $scheme->save();
                    return response()->json($data);
                }
                else{

                     $data[$key]=(object)[
                         'name'=>$newCklist->name,
                         'lastUpdate'=>now()->toDateTimeString(),
                         "version"=>$newCklist->version,
                         "data"=>isset($newCklist->data)?$newCklist->data:[],
                         "severity"=>isset($newCklist->severity)?$newCklist->severity:[],
                         "category"=>isset($newCklist->category)?$newCklist->category:[],
                         "passRules"=>isset($newCklist->passRules)?$newCklist->passRules:[],
                         "defaultNotes"=>isset($newCklist->defaultNotes)?$newCklist->defaultNotes:[],
                         "reportChart"=>isset($newCklist->reportChart)?$newCklist->reportChart:[]];
                        }
                   
                }
                else{
                    //error here
                    
                        array_push($data,(object)[
                            'name'=>$newCklist->name,
                            'lastUpdate'=>now()->toDateTimeString(),
                            "version"=>$newCklist->version,
                            "data"=>isset($newCklist->data)?$newCklist->data:[],
                            "severity"=>isset($newCklist->severity)?$newCklist->severity:[],
                            "category"=>isset($newCklist->category)?$newCklist->category:[],
                            "passRules"=>isset($newCklist->passRules)?$newCklist->passRules:[],
                            "defaultNotes"=>isset($newCklist->defaultNotes)?$newCklist->defaultNotes:[],
                            "reportChart"=>isset($newCklist->reportChart)?$newCklist->reportChart:[]
                        ]);
                }
            $scheme->cklistData=json_encode($data);
            $scheme->save();
            return response()->json(['index'=>count($data)-1]);
            }
            else{
                $scheme= new checklist;
                $scheme->cklistName=$request->name;
                $scheme->save();

                $cklist= checklist::select('cklistName','cklistPK as id')->get();
                foreach ($cklist as $c) {
                    $c->id=encrypt($c->id);
                }
                return response()->json(['id'=>encrypt($scheme->cklistPK),'schm'=>$cklist]);
            }
        }

    function deleteScheme(Request $request){
        
        $id=decrypt($request->id);
        $scheme= checklist::where("cklistPK",$id)->first();
        $scheme->delete();
        
        $cklist= checklist::select('cklistName','cklistPK as id')->get();
        foreach ($cklist as $c) {
            $c->id=encrypt($c->id);
        }
        return response()->json($cklist);

    }
    function postCklist(Request $request){
        
        $cmpny=dechex($request->cmpnyid);
        $data;
        // return response()->json($request);
        // dd("hai");
        
        $newCklist=(object)$request->data;
        if(Storage::exists($cmpny.'\data\schemelist')){
            $contents = Storage::get($cmpny.'\data\schemelist');
            $data=$this->unencodeMaster($contents);
            if($request->action=="delete"){
                unset( $data->{$request->id});
            }
            else{
                // return response()->json($newCklist);
                 $data->{$request->id}=(object)[
                     'name'=>$newCklist->name,
                     'lastUpdate'=>"",
                     "version"=>$newCklist->version,
                     "data"=>isset($newCklist->data)?$newCklist->data:[],
                     "severity"=>isset($newCklist->severity)?$newCklist->severity:[],
                     "category"=>isset($newCklist->category)?$newCklist->category:[],
                     "passRules"=>isset($newCklist->passRules)?$newCklist->passRules:[],
                     "defaultNotes"=>isset($newCklist->defaultNotes)?$newCklist->defaultNotes:[],
                     "reportChart"=>isset($newCklist->reportChart)?$newCklist->reportChart:[]];
            }
            
            // $key=array_search($request->id, array_column($data, 'id'));
           
        }
        else{

            $data = (object)[];
           
            $data->{$request->id}=(object)['name'=>$newCklist->cklistName,'lastUpdate'=>"","version"=>$newCklist->version,"data"=>$newCklist->data,"severity"=>$newCklist->severity,"category"=>$newCklist->category];
                }
            //$data = (object)['p1'=>$request->data];
        
        
        Storage::put($cmpny.'\data\schemelist', $this->encodeMaster($data));
       
        return response()->json($data);
        // array_search($post_title, array_column($data, 'id'));

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

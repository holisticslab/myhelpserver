<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class meetingController extends Controller
{
    //
    function startMeeting(Request $request){
        
        $id= $request->id;
        $premise= $request->premise;
        $date= $request->date;
        $auditTitle= $request->auditTitle;
        $data= $request->data;

        $data=(object)[
            'title'=>$auditTitle,
            'data'=>$data,
            'date'=>$date,
            "premise"=>$premise,
            "id"=>$id];


            Storage::put('meeting\\'.$id, $this->encodeMaster($data));
        // $requestKeys = collect($request->all())->keys();
        // return response()->json(Auth::user());
        // $id=Auth::user()->getCompany();
        // return response()->json(Auth::user());

        return response()->json(['session'=>encrypt($id)]);
        // cmpnyLink
        
        // return response()->json($id);
        // return response("start Meeting");
        // $session=encrypt($request->session);
        
        // Storage::put($session.'\session', $this->encodeMaster($request->info));

        // $newEncrypter = new \Illuminate\Encryption\Encrypter( $request->key, Config::get( 'app.cipher' ) );
        // $encrypted = $newEncrypter->encrypt( $request->data );
        // Storage::put($session.'\session\data', $this->encodeMaster($encrypted));

      
    }

    function getInfo($session){
        $session=decrypt($session);
        
        if(Storage::exists('meeting\\'.$session)){
            $contents = Storage::get('meeting\\'.$session);
            $data=$this->unencodeMaster($contents);
            $data->id=encrypt($data->id);
            return response()->json($data);
        }
        else{return  response("xdapat");}
    }

    function updateMeeting(Request $request){

        $id=decrypt($request->id);
        
        if(Storage::exists('meeting\\'.$id)){
            $contents = Storage::get('meeting\\'.$id);
            $data=$this->unencodeMaster($contents);
            $data->data=$request->newdata;

            Storage::put('meeting\\'.$id, $this->encodeMaster($data));

            return response()->json(["result"=>"Success","data"=>$data]);
        }
        else{return  response("xdapat");}
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

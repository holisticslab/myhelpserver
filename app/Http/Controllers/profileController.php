<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use  App\Models\user;

class profileController extends Controller
{
    //
    
    function getAllProfile(){
        
        $usr= user::leftJoin('companies','cmpnyPK','cmpnyFK')->select('id','name','username','lastLogin','lastLoginIP','cmpnyName','cmpnyFK as cmpnyID')->get();
        foreach ($usr as $c) {
            $c->id=encrypt($c->id);
            }
        return response()->json($usr);
    }

    function createSubscription(Request $request){

        if($request->subcrPK){
            $subcr = subscription::where('subcrPK',$request->subcrPK)->first();
        }
        else{
            $subcr = new subscription;
        }
        
        $subcr->cmpnyFK =$request->company;
        $subcr->dateStart =$request->datestart;
        $subcr->dateEnd =$request->dateend;
        $subcr->subcrDetails = json_encode($request->details);
        $subcr->save();
      $subcr->subcrDetails = json_decode($subcr->subcrDetails);
        return response()->json($subcr);

    }

    function deleteSubscription(Request $request){
        
        $subcr = subscription::where('subcrPK',$request->pk)->first();
        $subcr->delete();
        return response()->json(['isSuccess' =>true,'message'=>"Successfull Delete"]);

    }
}

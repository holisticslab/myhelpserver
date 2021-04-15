<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use  App\Models\standard;

class standardController extends Controller
{
    //
    function getAllStandard(){
        
        $std= standard::orderBy('code')->get();
        foreach ($std as $c) {
        $c->data=json_decode($c->data);
        }
        return response()->json($std);
    }

    function saveStandard(Request $request){

        $standard = standard::firstOrNew([
            'stdPK' =>  trim($request->stdPK),
            ]);
        $standard->code = $request->code??"";
        $standard->name = $request->name;
        $standard->lang = $request->lang;
        $standard->data = json_encode($request->data);
        $standard->save();
        
        return response()->json($standard);
    }
}

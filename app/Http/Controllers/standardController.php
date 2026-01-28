<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use  App\Models\standard;

class standardController extends Controller
{
    //
    function getAllStandard(){
        
        $std= standard::select('code','name','lang','stdPK as id')->orderBy('code')->get();
        foreach ($std as $c) {
            $c->id=encrypt($c->id);
            }
        return response()->json($std);
    }

    function getStandardDtl($id){
        
        $id=decrypt($id);
        $std= standard::select('code','name','lang','data','stdPK as id')->orderBy('code')->where('stdPK',$id)->first();
        $std->id=encrypt($std->id);
        $std->data=json_decode($std->data);
        return response()->json($std);
    }

    function saveStandard(Request $request){
        $id=trim(decrypt($request->id));
        $standard = standard::firstOrNew([
            'stdPK' => $id,
            ]);
        $standard->code = $request->code??"";
        $standard->name = $request->name;
        $standard->lang = $request->lang;
        $standard->data = json_encode($request->data);
        $standard->save();
        
        return response()->json($standard);
    }

    function addStandard(Request $request){

        $standard=new standard;
        $standard->code = $request->code??"";
        $standard->name = $request->name;
        $standard->lang = $request->lang;
        $standard->data = "{}";
        $standard->save();

        return response()->json($standard);
    }
}

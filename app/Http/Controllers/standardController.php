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
}

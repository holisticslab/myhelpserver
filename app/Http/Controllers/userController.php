<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use  App\Models\User;
use  App\Models\profile;
use  App\Models\company;
use  App\Models\role;
use Illuminate\Support\Facades\Hash;

use Illuminate\Support\Facades\Auth;

class userController extends Controller
{
    //

    function getAllUser(){
        
        $usr= user::leftJoin('companies','cmpnyPK','cmpnyFK')
        ->leftJoin('roles','rolePK','roleFK')
        ->select('id','name','username','lastLogin','lastLoginIP','cmpnyName','cmpnyFK as cmpnyID','roleFK','rolename')->get();
        return response()->json($usr);
    }
    function getRoles(){
        
        $role=Auth::user()->getRoleLevel();
        $roles= role::where('rolelevel','>=',$role)->get();
        return response()->json($roles);
    }
    function addUser(Request $request){
        // Auth::id()
        $role=Auth::user()->getRoleLevel();
        
       if($role==4){
        if($request->id && $request->id == Auth::id()){
            $usr = User::where('id',$request->id)->first();
            if($request->password!="default"){
                $usr->password =Hash::make($request->password);
            }
        }
        else{
            return response()->json(['isSuccess' =>false,'message'=>"You are not allowed to perform this action"],401);
        }
        }
        else{
            if($request->id){
                $usr = User::where('id',$request->id)->first();
                if($request->password!="default"){
                $usr->password =Hash::make($request->password) ;}
            }
            else{
                $usr = new User;
                $usr->password =Hash::make($request->password) ;
            }
            // $usr->lastLoginIP =$request->getClientIp();
            if($request->cmpnyid){
                $usr->cmpnyFK=$request->cmpnyid;
            }
            if($request->role){
                $usr->roleFK=$request->role;
            }
            if($request->position){
                $usr->position=$request->position;
            }
        }

        
        $usr->username = $request->username;
        $usr->name = $request->name;
        
        
        $usr->save();

        $usr->rolename=$usr->getRole()->rolename;

        return response()->json($usr);
        // $usr->userPwd = Hash::make($request->password);
        // $usr->userName = $request->name;
        // $usr->userIC = $request->icno;
        // $usr->cmpnyFK = $request->cmpnyid;
        // $usr->userAdmin = $request->admin; 
       // $usr->save();
    }

    // function addProfile(){
    //     $myObj=(object)array(array('id'=>1));

    //     $myObj2=(object)array();
    //     $usr = new profile;
    //     $usr->name = "Holistics Lab Sdn Bhd";
    //     $usr->users = json_encode($myObj);
    //     $usr->accounts = json_encode($myObj2);
    //     $usr->save();
    //     return response()->json($usr);
    // }
    function deleteUser(Request $request){
        $usr = User::where('id',$request->id)->first();
        $usr->delete();
        return response()->json(['isSuccess' =>true,'message'=>"Successfull Delete"]);
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
        $usr->save();
        return response()->json($usr);
    }

    function updateCompany(){
        $cmpny= company::get();
        foreach ($cmpny as $c) {
            $usr;
            if($c == "1"){
                $usr = profile::where('profilePK', '<', 6)->select('profilePK as id','name')->get();
            }
            else{
                $usr = profile::where('profilePK', '>', 5)->select('profilePK as id','name')->get();
            }
            $c->cmpnyStaff =json_encode($usr) ;
            $c->save();
        }

    }

    function updateUser(){

        $users= company::where('cmpnyPK', '=', 2)->select('cmpnyPK as id','cmpnyName')->get();
      
        $usr = profile::where('profilePK', '>', 5)->get();
        foreach ($usr as $lalala) {
            $lalala->accounts =json_encode($users) ;
            $lalala->save();
        }
      
        return response()->json($usr);
    }

    function getuser(){

        $usr=Auth::user()->profile();
      
        return response()->json($usr);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use  App\Models\subscription;
use  App\Models\user;
use  App\Models\checklist;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class subscriptionController extends Controller
{
    //

    function getAllSubcription(){
        
        $subcr= subscription::select('dateStart','dateEnd','subcrDetails','cmpnyFK',
        'subcrPK')->orderBy('subcrPK','desc')->get();
        foreach ($subcr as $c) {
            
            $c->id=encrypt($c->cmpnyFK);
            $c->subcrDetails=json_decode($c->subcrDetails);
        }
        return response()->json($subcr);
    }

    function getclientdata(){
        
        $id=Auth::user()->getCompany()->cmpnyPK;
        $rolelevel=Auth::user()->getRoleLevel();

        $usr= user::select('id','name','username','roleFK','lastLogin','lastLoginIP','rolename','position')
        ->leftJoin('roles','rolePK','roleFK')
        ->where('cmpnyFK',$id)->get();
        $subcr= subscription::select('dateStart','dateEnd','subcrDetails','cmpnyFK',
        'subcrPK')->where('cmpnyFK',$id)->orderBy('dateEnd','desc')->first();
        if($subcr) $subcr->subcrDetails=json_decode($subcr->subcrDetails);
        $cklist= checklist::get();
        foreach ($cklist as $c) {
            $c->cklistData=json_decode($c->cklistData);
            }
            
        $returnObj = (object)['isSuccess' =>false,'allowedSchm'=>null,'active_subcr'=>$subcr,'users'=>$usr,'data'=>null,'premises'=>null,'schmlist'=>null,'stockCkList'=>$cklist];
        $id=dechex($id);

        $premises;
        $schmlist;
        
        if(Storage::exists($id.'\data\prms')){
            $contents = Storage::get($id.'\data\prms');
            $returnObj->premises=$this->unencodeMaster($contents);
            $premises=$this->unencodeMaster($contents);
        }
        if(Storage::exists($id.'\data\schemelist')){
            $contents = Storage::get($id.'\data\schemelist');
            $returnObj->schmlist=$this->unencodeMaster($contents);
            $schmlist=[];
        }
        if(Storage::exists($id.'\data\subcr')){
            $contents = Storage::get($id.'\data\subcr');
            $returnObj->data=$this->unencodeMaster($contents);

            $data=$this->unencodeMaster($contents);
            foreach ($data as $key => $value) {
                $value=(object)$value;
                $idx=array_search(Auth::id(),$value->users);
              if($idx>-1){
                foreach ($value->cklists as $v) {
                //     if(!is_array($v) &&  property_exists($schmlist, $v)){
                //     if(array_search($v, array_column($returnObj->cklists, 'id'))==false){
                //         if (property_exists($schmlist, $v)){
                //     $schmlist->{$v}->id=$v;
                //     array_push($returnObj->cklists,$schmlist->{$v} );}

                // }}
                array_push($schmlist,$v );
                }
              } 
            }
        }
        $returnObj->allowedSchm=$schmlist;
        return response()->json($returnObj);
    }

    function getLatestCklist($id){
        $userid=Auth::user()->getCompany()->cmpnyPK;
        $userid=dechex($userid);

        if(Storage::exists($userid.'\data\schemelist')){
            $contents = Storage::get($userid.'\data\schemelist');
            $data=$this->unencodeMaster($contents);
            $data->{$id}->id=$id;
            return response()->json($data->{$id});
        }

    }
    function getSubscriptionData($id){
        $id=decrypt($id);
        $usr= user::select('id','name','username','lastLogin','lastLoginIP')->where('cmpnyFK',$id)->get();
        $cklist= checklist::select('cklistPK as id','cklistName','cklistLang')->get();
        foreach ($cklist as $c) {
            $c->id=encrypt($c->id);
            }
        // $obj3 = (object)['data'=>"test",'rata'=>"best"];
        // Storage::put($id.'\datar', $this->encodeMaster($obj3));

        // $contents = Storage::get($id.'\datar');
        $returnObj = (object)['isSuccess' =>false,'users'=>$usr,'stockCkList'=>$cklist];

        
        $id=dechex($id);
        if(Storage::exists($id.'\data\subcr')){
            $contents = Storage::get($id.'\data\subcr');
            $returnObj->data=$this->unencodeMaster($contents);
        }
        if(Storage::exists($id.'\data\prms')){
            $contents = Storage::get($id.'\data\prms');
            $returnObj->premises=$this->unencodeMaster($contents);
        }
        if(Storage::exists($id.'\data\schemelist')){
            $contents = Storage::get($id.'\data\schemelist');
            $returnObj->schmlist=$this->unencodeMaster($contents);
        }
        return response()->json($returnObj);
    }

    function addSubcrCklist(Request $request){
        
        $cmpny=dechex($request->cmpnyid);
        $data;
        if(Storage::exists($cmpny.'\data\schemelist')){
            $contents = Storage::get($cmpny.'\data\schemelist');
            $data=$this->unencodeMaster($contents);
            $stocklist=array();
            if($request->action=="delete"){
                unset( $data->{$request->id});
            }
            else{
                foreach ($request->cklists as $c) {
                    array_push($stocklist,decrypt($c));
                    }
                 $datalist=checklist::whereIn('cklistPK',$stocklist)->get();
                 foreach ($datalist as $c) {
                     $tempdata=json_decode($c->cklistData);

                    $data->{'c'.$c->cklistPK}=(object)$tempdata[count($tempdata)-1];
                    }
            }
            
            // $key=array_search($request->id, array_column($data, 'id'));
           
        }
        else{
            $stocklist=array();
            $data = (object)[];
            foreach ($request->cklists as $c) {
                array_push($stocklist,decrypt($c));
                }
             $datalist=checklist::whereIn('cklistPK',$stocklist)->get();
             foreach ($datalist as $c) {
                 $tempdata=json_decode($c->cklistData);
                $data->{'c'.$c->cklistPK}=(object)$tempdata[count($tempdata)-1];
                }
            //$data = (object)['p1'=>$request->data];
        }
        
        Storage::put($cmpny.'\data\schemelist', $this->encodeMaster($data));
       
       return response()->json($data);
        // array_search($post_title, array_column($data, 'id'));

    }
    function addPremise(Request $request){
        $cmpny=dechex($request->cmpnyid);
        $data;
        if(Storage::exists($cmpny.'\data\prms')){
            $contents = Storage::get($cmpny.'\data\prms');
            $data=$this->unencodeMaster($contents);
            $key=$request->id;
            // $key=array_search($request->id, array_column($data, 'id'));
            
            if($key){
                if($request->action=="delete"){
                    unset( $data->{$key});
                }
                else{
                    $data->{$key}=$request->data;
                }
            }
            else{
                $keylist=array_keys(get_object_vars($data));
            $lastkey=end($keylist);
            $key=(int)substr($lastkey,1)+1;

            

            while (property_exists($data, 'p'.$key)) {
                $key++;
              }

            $data->{'p'.$key}=$request->data;
            

            if($cmpny==6 && Storage::exists($cmpny.'\data\subcr')){
                
                $newkeylist=array_keys(get_object_vars($data));
                $newData=(object)[];
                // return response()->json(['isSuccess' =>$data],500);
                usort($newkeylist, fn($a, $b) => strcmp(((object)$data->{$a})->name,((object)$data->{$b})->name));

                foreach ($newkeylist as $c) {
                    $newData->{$c}=$data->{$c};
                    }
                    

                $contents = Storage::get($cmpny.'\data\subcr');
                $sdata=$this->unencodeMaster($contents);
                foreach ($sdata as $key => $value) {
                    // dd($sdata->{$key});
                    $sdata->{$key}= (object)$sdata->{$key};
                
                $sdata->{$key}->premises=array_keys(get_object_vars($data));
                }

                Storage::put($cmpny.'\data\subcr', $this->encodeMaster($sdata));
                $data=$newData;
            }

            }
        }
        else{
            $data = (object)['p1'=>$request->data];
        }
        
        Storage::put($cmpny.'\data\prms', $this->encodeMaster($data));
       
       return response()->json($data);
        // array_search($post_title, array_column($data, 'id'));

    }

    function postSubcription (Request $request){
        $cmpny=dechex($request->cmpnyid);
        $data;
        if(Storage::exists($cmpny.'\data\subcr')){
            $contents = Storage::get($cmpny.'\data\subcr');
            $data=$this->unencodeMaster($contents);
            $key=$request->id;
            // $key=array_search($request->id, array_column($data, 'id'));
            if($key){
                if($request->action=="delete"){
                    unset( $data->{$key});
                }
                else{
                    $data->{$key}=$request->data;
                }
            }
            else{
                $keylist=array_keys(get_object_vars($data));
            $lastkey=end($keylist);
            $key=(int)substr($lastkey,1)+1;
            $data->{'s'.$key}=$request->data;
            }
        }
        else{
            $data = (object)['s1'=>$request->data];
        }
        
        Storage::put($cmpny.'\data\subcr', $this->encodeMaster($data));
       
       return response()->json($data);
        // array_search($post_title, array_column($data, 'id'));

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

    function getIndSubscription(){
        $id=Auth::user()->getCompany()->cmpnyPK;

        $subcr= subscription::select('dateStart','dateEnd')->where('cmpnyFK',$id)->orderBy('dateEnd','desc')->first();
        
        $returnObj = (object)['isSuccess' =>true,'subscription' =>$subcr];

        // if($subcr){

            $id=dechex($id);
            $premises;
            $schmlist;

            $returnObj->premises=array();
            $returnObj->cklists=array();

            if(Storage::exists($id.'\data\prms')){
                $contents = Storage::get($id.'\data\prms');
                $premises=$this->unencodeMaster($contents);
                $premises=json_decode(json_encode($premises));

            }
            if(Storage::exists($id.'\data\schemelist')){
                $contents = Storage::get($id.'\data\schemelist');
                $schmlist=$this->unencodeMaster($contents);
            }

            if(Storage::exists($id.'\data\subcr')){
                $contents = Storage::get($id.'\data\subcr');
                $data=$this->unencodeMaster($contents);
                foreach ($data as $key => $value) {
                    $value=(object)$value;
                    $idx=array_search(Auth::id(),$value->users);
                  if($idx>-1){
                    foreach ($value->cklists as $v) {
                        if(!is_array($v) &&  property_exists($schmlist, $v)){
                        if(array_search($v, array_column($returnObj->cklists, 'id'))==false){
                            if (property_exists($schmlist, $v)){
                        $schmlist->{$v}->id=$v;
                        array_push($returnObj->cklists,$schmlist->{$v} );}
                    }}
                    }
                    foreach ($value->premises as $l) {
                        if(array_search($l, array_column($returnObj->premises, 'id'))==false){
                            if (property_exists($premises, $l)) {
                                $premises->{$l}->id=$l;
                                array_push($returnObj->premises,$premises->{$l});
                            }

                         }
                    }
                  } 
                }

                $returnObj->isSuccess=true;
            }

        // }
        
       return response()->json($returnObj);
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

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use  App\Models\company;
use  App\Models\personal_access_token;
use  App\Models\subscription;

use Carbon\Carbon;

class authController extends Controller
{
    //

    public function authenticate(Request $request)
    {
        $credentials;
        if($request->id){
            $id=decrypt($request->id);
            $request->merge([
                'cmpnyFK' => $id,
            ]);
            $credentials = $request->only('username', 'password','cmpnyFK');
        }
        else {$credentials = $request->only('username', 'password');}

        if (Auth::attempt($credentials)) {
            // Authentication passed...
            //return redirect()->intended('dashboard');
            $user = Auth::user();
            $user->lastLoginIP = $request->getClientIp();
            $user->lastLogin =  now()->toDateTimeString();
            $user->save();
            
            $user->accesslvl=Auth::user()->getRoleLevel();

            return response()->json(['isSuccess' =>true,'session'=>$request->session()->all(),'user' =>Auth::user(),'accesslevel'=>Auth::user()->getRoleLevel(),'cmpny'=>Auth::user()->getCompany()]);
          
        }
        else{
            return response()->json(['isSuccess' =>false,'message'=>"Invalid Username and Password"],401);
        }
    }
    public function getUser(Request $request)
    {
        $usr=Auth::user();
        $usr->accesslvl=Auth::user()->getRoleLevel();
            return response()->json(['isSuccess' =>true,'session'=>$request->session()->all(),'user' =>$usr,'cmpny'=>Auth::user()->getCompany(),'accesslevel'=>Auth::user()->getRoleLevel()]);
        
    }
    public function getCustomLogin()
    {
        $cmpny=company::select('cmpnyPK as id','cmpnyLink','cmpnyConfig')->whereNotNull('cmpnyLink')->get();
        foreach ($cmpny as $c) {
            $c->cmpnyConfig=json_decode($c->cmpnyConfig);
            $c->id=encrypt($c->id);
            // $c->cmpnyPK=encrypt($c->cmpnyPK);
        }
        return response()->json($cmpny);
    }

    
    public function login(Request $request)
  {
  try {
    
    $credentials = $request->only('username', 'password');
    if (!Auth::attempt($credentials)) {
      
      return response()->json(['isSuccess' =>false,'message'=>"Invalid Username and Password"],401);
    }
    $user = Auth::user();
    if ( ! Hash::check($request->password, $user->password, [])) {
       throw new \Exception('Error in Login');
    }
    $existtoken=$user->tokens()->first();

    if($existtoken){

        $existtoken->delete();

    }
    $tokenResult = $user->createToken('authToken')->plainTextToken;

    $user = Auth::user();
    $user->lastLoginIP = $request->getClientIp();
    $user->lastLogin =  now()->toDateTimeString();
    $user->save();

    $subcr= subscription::select('dateStart','dateEnd')->where('cmpnyFK',Auth::user()->getCompany()->cmpnyPK)->where('dateStart', '<=', Carbon::now())->where('dateEnd', '>=', Carbon::now())->orderBy('dateEnd','desc')->first();
    return response()->json(['isSuccess' =>true,'user' =>Auth::user(),'accesslevel'=>Auth::user()->getRoleLevel(),'cmpny'=>Auth::user()->getCompany(),'access_token' => $tokenResult,'subcr'=>$subcr]);
  
  } catch (Exception $error) {
    return response()->json([
      'isSuccess'=>false,
      'status_code' => 500,
      'message' => 'Error in Login',
      'error' => $error,
    ]);
  }
}

public function mcdlogin(Request $request)
{
try {
  $request->merge([
    'cmpnyFK' => 6,
    ]);

    $credentials = $request->only('username', 'password','cmpnyFK');
  $request->merge([
    'cmpnyFK' => 2,
    ]);
    $credentials2 = $request->only('username', 'password','cmpnyFK');
    
  if (Auth::attempt($credentials)===false && Auth::attempt($credentials2)===false ) {
    return response()->json(['isSuccess' =>false,'message'=>"Invalid Username and Password"],401);
  }

  $user = Auth::user();
  if ( ! Hash::check($request->password, $user->password, [])) {
     throw new \Exception('Error in Login');
  }
  $existtoken=$user->tokens()->first();

  if($existtoken){

      $existtoken->delete();

  }
  $tokenResult = $user->createToken('authToken')->plainTextToken;

  $user = Auth::user();
  $user->lastLoginIP = $request->getClientIp();
  $user->lastLogin =  now()->toDateTimeString();
  $user->save();

  $subcr= subscription::select('dateStart','dateEnd')->where('cmpnyFK',Auth::user()->getCompany()->cmpnyPK)->where('dateStart', '<=', Carbon::now())->where('dateEnd', '>=', Carbon::now())->orderBy('dateEnd','desc')->first();
  return response()->json(['isSuccess' =>true,'user' =>Auth::user(),'accesslevel'=>Auth::user()->getRoleLevel(),'cmpny'=>Auth::user()->getCompany(),'access_token' => $tokenResult,'subcr'=>$subcr]);

} catch (Exception $error) {
  return response()->json([
    'isSuccess'=>false,
    'status_code' => 500,
    'message' => 'Error in Login',
    'error' => $error,
  ]);
}
}
}

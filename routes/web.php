<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/clear-cache', function() {
    Artisan::call('cache:clear');
    return "Cache is cleared";
});

Route::get('/config-cache', function() {
    Artisan::call('config:cache');
    return "create cache";
});

Route::post('/login', "authController@authenticate")->middleware('throttle:login');

Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::get('/user', "authController@getUser");
    Route::get('/getroles', "userController@getRoles");
    Route::get('/getprofile', "userController@getAllUser");
    Route::get('/getscheme',"checklistController@getAllCklist");
    Route::get('/getstandard',"standardController@getAllStandard");
    Route::post('/savestandard',"standardController@saveStandard");
    
    Route::get('/getcompany',"companyController@getAllCompany");
    Route::get('/getsubscription',"subscriptionController@getAllSubcription");
    Route::get('/getsubcrdata/{id?}',"subscriptionController@getSubscriptionData");
    Route::post('/createsubscription',"subscriptionController@createSubscription");
    Route::post('/deletesubscription',"subscriptionController@deleteSubscription");
    Route::post('/postuser',"userController@addUser");
    Route::post('/postpremise',"subscriptionController@addPremise");
    Route::post('/postsubcr',"subscriptionController@postSubcription");
    Route::post('/addsubcrcklist',"subscriptionController@addSubcrCklist");
    Route::post('/deleteuser',"userController@deleteUser");

    
    Route::post('/postcklist',"subscriptionController@postCklist");
    Route::post('/postclientcklist',"checklistController@postCklist");

    
    Route::post('/savecklist',"checklistController@savecklist");
    
    
    Route::get('/getstaffcmpny/{id}',"companyController@getStaffCompany");
    
    Route::post('/updcompany',"companyController@updCompany");
    
    Route::get('/getclientdata',"subscriptionController@getclientdata");
    Route::get('/getindsubscr',"subscriptionController@getIndSubscription");

    
    
});


Route::get('/logout',function (){
    Auth::logout();
    return response()->json(['logout' =>true]);
});
Route::get('/customlogin',"authController@getCustomLogin");

// Route::get('/addcmpny',"userController@addcompany");
// Route::get('/upduser',"userController@updateuser");
// Route::get('/updcmpny',"userController@updateCompany");
Route::get('/getcklist',"migrationController@getCklist");
Route::get('/getstd',"migrationController@getStandard");
// Route::get('/getmcdPremise',"migrationController@migrateMCD");
// Route::get('/getprofile',"userController@getuser");


Route::get('/policy', function () {
    return view('policy');
});

Route::get('/{path?}', function () {
    return view('app');
})->where('path', '.*');
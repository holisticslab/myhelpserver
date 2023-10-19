<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class meetingVerifier
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if(Storage::exists('meeting'.$id.'\data\prms')){
            $contents = Storage::get($id.'\data\prms');
            $returnObj->premises=$this->unencodeMaster($contents);
            $premises=$this->unencodeMaster($contents);
        }

        return $next($request);
    }
}

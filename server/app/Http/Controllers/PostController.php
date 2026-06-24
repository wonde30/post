<?php

namespace App\Http\Controllers;

use App\Models\post;
use App\Http\Resources\PostResource;
use App\Http\Requests\PostRequest;
use Illuminate\Http\Request;


class Postcontroller extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::with('user')->latest()->paginate(10);
        return PostResource::collection($posts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function myPosts(Request $request)
    {
        $posts = $request->user()->posts()->latest()->paginate(10);
        return PostResource::collection($posts);
    }

    public function store(PostRequest $request)
    {
        $post = $request->user()->posts()->create(
            $request->validated()
        );
        return (new PostResource($post))->response()->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        return new PostResource($post->load('user'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PostRequest $request, Post $post)
    {
        if ($post->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $post->update($request->validated());
        return new PostResource($post);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post, Request $request)
    {
        if ($post->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        $post->delete();
        return response()->json(['message' => 'Post deleted']);
    }
}

<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_post(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user, 'sanctum')
            ->postJson('/api/posts', [
                'title' => 'My First Post',
                'body' => 'This is my post body',
                'author' => 'Wonde',
                'published' => true,
            ]);

        $response
            ->assertStatus(201)
            ->assertJson([
                'data' => [
                    'title' => 'My First Post',
                ],
            ]);

        $this->assertDatabaseHas('posts', [
            'title' => 'My First Post',
        ]);
    }


    public function test_anyone_can_view_posts(): void
    {
        Post::factory()->create();

        $response = $this->getJson('/api/posts');

        $response
            ->assertStatus(200);
    }


    public function test_user_can_delete_own_post(): void
    {
        $user = User::factory()->create();

        $post = Post::factory()->create([
            'user_id' => $user->id,
        ]);

        $response = $this
            ->actingAs($user, 'sanctum')
            ->deleteJson("/api/posts/{$post->id}");

        $response
            ->assertStatus(200);

        $this->assertDatabaseMissing('posts', [
            'id' => $post->id,
        ]);
    }
}

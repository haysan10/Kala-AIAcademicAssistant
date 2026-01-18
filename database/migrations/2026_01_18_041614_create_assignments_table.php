<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('assignments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();

            // Core fields
            $table->string('title');
            $table->text('description')->nullable();
            $table->dateTime('due_date');

            // AI-related
            $table->longText('raw_context')->nullable();
            $table->json('parsed_data')->nullable();

            // Status tracking
            $table->enum('status', ['pending', 'in_progress', 'at_risk', 'completed'])
                ->default('pending');
            $table->integer('total_estimated_minutes')->default(0);
            $table->integer('completed_tasks_count')->default(0);
            $table->integer('total_tasks_count')->default(0);

            $table->timestamps();

            // Indexes
            $table->index(['user_id', 'status']);
            $table->index('due_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assignments');
    }
};

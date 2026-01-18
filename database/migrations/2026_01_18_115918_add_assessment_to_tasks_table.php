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
        Schema::table('tasks', function (Blueprint $table) {
            $table->text('mastery_assessment')->nullable()->after('completed_at');
            $table->unsignedTinyInteger('understanding_score')->nullable()->after('mastery_assessment'); // 1-5 or 1-100
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn(['mastery_assessment', 'understanding_score']);
        });
    }
};

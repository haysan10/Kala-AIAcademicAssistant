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
        Schema::table('users', function (Blueprint $table) {
            $table->string('ai_language')->default('id')->after('timezone');
            $table->string('ai_persona')->default('academic')->after('ai_language'); // academic, motivational, casual, professional
            $table->text('ai_custom_instructions')->nullable()->after('ai_persona');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['ai_language', 'ai_persona', 'ai_custom_instructions']);
        });
    }
};

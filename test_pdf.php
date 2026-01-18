<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$pdfPath = '/Users/haysan/Documents/WEBAPPS/Kala/Tugas_Pengenalan_Statistika.pdf';

echo "Testing PDF Extraction for: $pdfPath" . PHP_EOL;

if (!file_exists($pdfPath)) {
    echo "ERROR: File does not exist." . PHP_EOL;
    exit;
}

try {
    $parser = new \Smalot\PdfParser\Parser();
    $pdf = $parser->parseFile($pdfPath);
    $text = $pdf->getText();

    echo "SUCCESS! Extracted Text Length: " . strlen($text) . " characters." . PHP_EOL;
    echo "--- START PREVIEW ---" . PHP_EOL;
    echo substr($text, 0, 500) . PHP_EOL;
    echo "--- END PREVIEW ---" . PHP_EOL;
} catch (\Exception $e) {
    echo "ERROR during extraction: " . $e->getMessage() . PHP_EOL;
}

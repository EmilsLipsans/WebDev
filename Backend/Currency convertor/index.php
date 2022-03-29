<?php

/**
 * This is the main file which receives and analyzes data, 
 * generates response data and finally calls the template.
 */

// show all warnings and errors on the screen
error_reporting(E_ALL);
ini_set('display_errors', 1);

$currencies = array ("USD"=>"US dollar",
"JPY"=>"Japanese yen",
"BGN"=>"Bulgarian lev",
"CZK"=>"Czech koruna",
"DKK"=>"Danish krone",
"GBP"=>"Pound sterling",
"HUF"=>"Hungarian forint",
"PLN"=>"Polish zloty",
"RON"=>"Romanian leu",
"SEK"=>"Swedish krona",
"CHF"=>"Swiss franc",
"ISK"=>"Icelandic krona",
"NOK"=>"Norwegian krone",
"HRK"=>"Croatian kuna",
"RUB"=>"Russian rouble",
"TRY"=>"Turkish lira",
"AUD"=>"Australian dollar",
"BRL"=>"Brazilian real",
"CAD"=>"Canadian dollar",
"CNY"=>"Chinese yuan renminbi",
"HKD"=>"Hong Kong dollar",
"IDR"=>"Indonesian rupiah",
"ILS"=>"Israeli shekel",
"INR"=>"Indian rupee",
"KRW"=>"South Korean won",
"MXN"=>"Mexican peso",
"MYR"=>"Malaysian ringgit",
"NZD"=>"New Zealand dollar",
"PHP"=>"Philippine peso",
"SGD"=>"Singapore dollar",
"THB"=>"Thai baht",
"ZAR"=>"South African rand");

// DO NOT EDIT BEFORE THIS LINE

/* Functions and classes You might want to use (you have to study function descriptions and examples)
 * Note: You can easily solve this task without using any regular expressions
file_get_contents() http://lv1.php.net/file_get_contents
file_put_contents() http://lv1.php.net/file_put_contents
file_exists() http://lv1.php.net/file_exists
round() http://lv1.php.net/round
SimpleXMLElement http://php.net/manual/en/simplexml.examples-basic.php http://php.net/manual/en/class.simplexmlelement.php 
date() http://lv1.php.net/manual/en/function.date.php or Date http://lv1.php.net/manual/en/class.datetime.php
Multiple string functions (choose by studying descriptions) http://lv1.php.net/manual/en/ref.strings.php
Multiple variable handling functions (choose by studying descriptions) http://lv1.php.net/manual/en/ref.var.php
Optionally you can use some array functions (with $_GET, $target_currencies) http://lv1.php.net/manual/en/ref.array.php
*/

// Your code goes here


$result = ""; //valid values: empty string, "OK", "ERROR"
$result_message = "";
$date = "";
const format = 'Y-m-d';

function downloadFile($currency, $filePath) {
    $currencyLowerCase = strtolower($currency);
    $currencyXML = file_get_contents("https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/{$currencyLowerCase}.xml");

    if (!$currencyXML) {
        throw new Exception("Could not download currency file");
    }

    $result = file_put_contents($filePath, $currencyXML);

    if (!$result) {
        throw new Exception("Could not save currency file");
    }

    return $currencyXML;
}

function find_exchange_value_by_date($arr, $date) {
    $size = $arr->count();

    for ($i = 0; $i < $size; $i++) {
        if ($date == $arr[$i]['TIME_PERIOD']) {
            return $arr[$i]['OBS_VALUE'];
        }
    }

    return false;
}

function getCurrency($currency, $date) {
    $filePath = "./xml/{$currency}.xml";

    $currencyValues = file_exists($filePath) ? file_get_contents($filePath) : downloadFile($currency, $filePath);

    $xml = new SimpleXMLElement($currencyValues);

    $value = find_exchange_value_by_date($xml->DataSet->Series->Obs, $date);

    if (!$value) {
        throw new Exception("Could not find exchange value");
    }

    return round($_GET['amount'] / $value, 2);
}

function isFirstLoad() {
    return count($_GET) == 0;
}

/**
 * @param array $currencies
 */
function checkErrors(array $currencies): void
{
    if (!isset($_GET['date']) || empty($_GET['date'])) {
        throw new Exception("Date is not set");
    }

    if (!isset($_GET['amount']) || empty($_GET['amount'])) {
        throw new Exception("Amount is not set");
    }

    if (!isset($_GET['currency']) || empty($_GET['currency'])) {
        throw new Exception("Currency is not set");
    }

    if (!is_numeric($_GET['amount'])) {
        throw new Exception("Amount is not numeric");
    }

    $date = DateTime::createFromFormat(format, $_GET['date']);

    if (!$date) {
        throw new Exception("Date is incorrect");
    }

    $currDate = new DateTime('NOW');
    $pastDate = DateTime::createFromFormat(format, '1999-01-04');

    if ($date <= $pastDate) {
        throw new Exception("Date can't be before 01/04/1999");
    }

    if ($date > $currDate) {
        throw new Exception("Can't use future date");
    }

    if (!array_key_exists($_GET['currency'], $currencies)) {
        throw new Exception("Currency is not available");
    }
}

function getNearestWorkDate() {
    $date = $_GET['date'];
    $dateTime = DateTime::createFromFormat(format, $date);

    $dayOfWeek = $dateTime->format('N');

    if ($dayOfWeek > 5) {
        $interval = $dayOfWeek-5;
        $dateTime->sub(new DateInterval("P{$interval}D"));
    }

    return $dateTime->format(format);
}

if (!isFirstLoad()) {
    try {
        checkErrors($currencies);
        $date = getNearestWorkDate();
        $result = "OK";
        $result_message = getCurrency($_GET['currency'], $date);
    } catch (Exception $e) {
        $result = "ERROR";
        $result_message = $e->getMessage();
    }
}
// DO NOT EDIT AFTER THIS LINE

require("view.php");
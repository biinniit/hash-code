<?php

  /*
   *
   * This was our dummy solution, just to get a score,
   * created at 9:34pm (UTC + 1), Feb 25, 2021.
   * 
   * Average runtime => 6s
   * Score => 59,050
   * 
   */

  // input file
  $input = fopen("f.txt", "r");
  // output file
  $output = fopen("f_output.txt", "w");
  // output file
  $dump = fopen("dump.txt", "w");

  $streets = [];
  $cars = [];
  $intersections = [];
  $n_ints_scheduled = 0;
  $output_string = "";
  
  class Intersections {
     public $in = [];
     public $out = [];
     public $scheduled = false;
  }

  list($total_dur, $n_int, $n_str, $n_cars, $bonus) = explode(" ", trim(fgets($input)));

  for($i = 0; $i < $n_str; ++$i) {
    list($start, $end, $name, $time) = explode(" ", trim(fgets($input)));
    $streets[$name] = [
      "start" => $start,
      "end" => $end,
      "time" => $time
    ];
  }

  for($i = 0; $i < $n_cars; ++$i)
    $cars[$i] = array_slice(explode(" ", trim(fgets($input))), 1);

  uasort($cars, function($a, $b) {
    global $streets;
    $atime = $btime = 0;
    foreach($a as $str)
      $atime += $streets[$str]["time"];
    foreach($b as $str)
      $btime += $streets[$str]["time"];
    return ($atime < $btime ? 1 : ($atime > $btime ? -1 : 0));
  });

  foreach($streets as $name => $str) {
    if(!key_exists($str["start"], $intersections))
      $intersections[$str["start"]] = new Intersections();
    $intersections[$str["start"]]->out[] = $name;

    if(!key_exists($str["end"], $intersections))
      $intersections[$str["end"]] = new Intersections();
    $intersections[$str["end"]]->in[] = $name;
  }

  // echo PHP_EOL, PHP_EOL, PHP_EOL;
  // ob_start();
  // var_dump($intersections);
  // fwrite($dump, ob_get_clean());
  // echo PHP_EOL, PHP_EOL, PHP_EOL;

  foreach($cars[0] as $str) {
    if($intersections[$streets[$str]["end"]]->scheduled)
      continue;
    $output_string .= $streets[$str]["end"] . PHP_EOL;
    $output_string .= count($intersections[$streets[$str]["end"]]->in) . PHP_EOL;
    foreach($intersections[$streets[$str]["end"]]->in as $inner_str)
      $output_string .= $inner_str . " 1" . PHP_EOL;
    $intersections[$streets[$str]["end"]]->scheduled = true;
    ++$n_ints_scheduled;
  }

  fwrite($output, $n_ints_scheduled . PHP_EOL . $output_string);

  fclose($input);
  fclose($output);
  fclose($dump);

  // PHP Notice:  Undefined index: rue-de-londres in /home/bennet/Documents/php/hash_code/2021/2021_qual/solution.php on line 51
// PHP Notice:  Undefined index: rue-de-londres in /home/bennet/Documents/php/hash_code/2021/2021_qual/solution.php on line 52
// PHP Notice:  Undefined index: rue-de-londres in /home/bennet/Documents/php/hash_code/2021/2021_qual/solution.php on line 53
// PHP Notice:  Undefined index: rue-de-londres in /home/bennet/Documents/php/hash_code/2021/2021_qual/solution.php on line 55
// PHP Notice:  Undefined index: rue-de-londres in /home/bennet/Documents/php/hash_code/2021/2021_qual/solution.php on line 57


?>

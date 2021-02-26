<?php

  /*
   *
   * This was our solution, created at 10:27pm (UTC + 1), Feb 25, 2021;
   * the contest ended at 10:30pm. With just 3 minutes left,
   * we were unable to run all datasets and make another solution.
   * 
   * Average runtime => 1m30s
   * Score => 8,280,886
   * 
   */

  // input file
  $input = fopen("b.txt", "r");
  // output file
  $output = fopen("b_output.txt", "w");

  $streets = [];
  $cars = [];
  $intersections = [];

  // not needed in new strategy
  // $n_ints_scheduled = 0;
  $output_string = "";
  
  class Intersections {
    public $in = [];
    public $in_score = [];
    public $in_score_total = 0;
    public $out = [];

    // not needed in new strategy
    // public $scheduled = false;
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
    // descending order
    return ($atime < $btime ? 1 : ($atime > $btime ? -1 : 0));
  });

  foreach($streets as $name => $str) {
    if(!key_exists($str["start"], $intersections))
      $intersections[$str["start"]] = new Intersections();
    $intersections[$str["start"]]->out[] = $name;

    if(!key_exists($str["end"], $intersections))
      $intersections[$str["end"]] = new Intersections();
    $intersections[$str["end"]]->in[] = $name;
    $intersections[$str["end"]]->in_score[] = 0;
  }

  // New output strategy
  foreach($intersections as $id => $intersection) {
    $n_fast_cars = intdiv($n_cars, 3);
    for($i = 0; $i < $n_fast_cars; ++$i)
      foreach($cars[$i] as $str)
        if(in_array($str, $intersection->in))
          $intersection->in_score[array_search($str, $intersection->in)]++;
    $intersection->in_score_total = array_sum($intersection->in_score);
    $output_string .= $id . PHP_EOL;
    $output_string .= count($intersection->in) . PHP_EOL;
    foreach($intersection->in as $iid => $inner_str)
      if($intersection->in_score[$iid] == 0)
        $output_string .= $inner_str . " 1" . PHP_EOL;
      else
        $output_string .= $inner_str . " "
          . max(1, intval($intersection->in_score[$iid] / $intersection->in_score_total * 10))
          . PHP_EOL;
  }

  /*
   * Old output strategy
   * 
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
  */

  fwrite($output, $n_int . PHP_EOL . $output_string);

  fclose($input);
  fclose($output);

?>

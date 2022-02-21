<?php

  // number of two-, three- and four-person teams
  $t2 = $t3 = $t4 = 0;
  // array containing lists of each pizza's ingredients
  $pizzas = [];
  // number of pizzas, equiv. to count($pizzas)
  // set as a separate variable to avoid costly call to count()
  $n_pizzas = 0;
  // input file
  $input = fopen("input.txt", "r");
  // output file
  $output = fopen("output.txt", "w");

  // read the data from the input file
  function read_input() {
    global $t2, $t3, $t4, $pizzas, $n_pizzas, $input;
    // read number of pizzas and n-person teams
    $line = fgets($input);
    list($n_pizzas, $t2, $t3, $t4) = explode(" ", trim($line));
    // read pizzas
    for($i = 0; $i < $n_pizzas; ++$i) {
      $line = fgets($input);
      $pizzas[] = array_slice(explode(" ", trim($line)), 1);
    }
    // close input file
    fclose($input);
  }

  // write output data to the submission file
  function write_output($output_string) {
    global $output;
    fwrite($output, $output_string); // write built output
    fclose($output); // close output file
  }

  read_input();

  $dlvs = 0; // number of teams delivered to
  $p_dlv = 0; // number of pizzas delivered
  $output_string = ""; // output string builder
  // if there's only 1 pizza, deliver it to the first available team
  if($n_pizzas == 1) {
    $output_string = ($t2 > 0 ? 2 : ($t3 > 0 ? 3 : 4)) . " 1\n";
    $dlvs = 1;
  }
  else {
    // attempt to deliver to all 2-person teams
    for( ; $t2-- && $p_dlv + 2 <= $n_pizzas; $p_dlv += 2, ++$dlvs)
      $output_string .= "2 " . $p_dlv . " " . ($p_dlv + 1) . "\n";
    // attempt to deliver to all 3-person teams
    for( ; $t3-- && $p_dlv + 3 <= $n_pizzas; $p_dlv += 3, ++$dlvs)
      $output_string .= "3 " . $p_dlv . " " . ($p_dlv + 1) . " " . ($p_dlv + 2) . "\n";
    // attempt to deliver to all 4-person teams
    for( ; $t4-- && $p_dlv + 4 <= $n_pizzas; $p_dlv += 4, ++$dlvs)
      $output_string .= "4 " . $p_dlv . " " . ($p_dlv + 1) . " " . ($p_dlv + 2) . " " . ($p_dlv + 3) . "\n";
  }

  write_output($dlvs . "\n" . $output_string);

?>

<?php

  function findIt(array $seq) : int
  {
    $mm = $seq;
    foreach($seq as $se){
      $orig_size = count($mm);
      $ll = array_diff($mm, [$se]);
      $new_size = count($ll);
      $check_count = $orig_size - $new_size;
      if($check_count % 2 != 0){
        return $se;
      }
      $mm = $ll;    
    }  // Enter your code here
  }

?>

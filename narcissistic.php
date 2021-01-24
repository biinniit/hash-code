<?php

function narcissistic(int $value): bool {
  $n_digits = 0;
  $result = 0;
  for($copy = $value; $copy; ++$n_digits)
    $copy = intdiv($copy, 10);
  for($copy = $value; $copy && $result <= $value; $copy = intdiv($copy, 10))
    $result += ($copy % 10) ** $n_digits;
  return $result == $value;
}

?>

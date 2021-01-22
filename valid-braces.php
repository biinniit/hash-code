function validBraces($braces) {
  if(strlen($braces) % 2 == 1)
    return false;
  $braces_array = str_split($braces);
  $stack = array();
  foreach($braces_array as $i)
    if($i == '(' || $i == '{' || $i == '[')
      array_push($stack, $i);
    else {
      $j = array_pop($stack);
      switch($j) {
        case '(':
          if($i != ')')
            return false;
          break;
        case '{':
          if($i != '}')
            return false;
          break;
        case '[':
          if($i != ']')
            return false;
          break;
      }
    }
  return empty($stack);
}

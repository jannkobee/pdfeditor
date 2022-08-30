<?php
class publ
{
    public function try()
    {
        if ($_SERVER["REQUEST_METHOD"] == "GET") {
            $array = array('status' => "200");
            echo json_encode($array);
        }
    }
}

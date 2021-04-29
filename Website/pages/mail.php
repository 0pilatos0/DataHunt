<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require "../../env.php";
require '../../vendor/autoload.php';


function sendVerificationMail($receiver, $person, $veritoken)
{
    try {
        $mail = new PHPMailer(true);
        $mail->SMTPDebug = SMTP::DEBUG_SERVER;
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = getenv("GMAILUSERNAME");
        $mail->Password = getenv("GMAILPASSWORD");
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom(getenv("GMAILUSERNAME"), 'Datahunt team');;
        $mail->addAddress($receiver, $person);

        $mail->isHTML(true);
        $mail->Subject = 'Thanks for joining us';
        $email_vars = array(
            'token' => $veritoken
            //hier kunnen meer email variables
        );
        $body = file_get_contents('../../Mail/htmlmail.html');

        if(isset($email_vars)){
            foreach($email_vars as $k=>$v){
                $mail->Body = str_replace('{'.strtoupper($k).'}', $v, $body);
            }
        }
        $mail->AltBody = 'Our mails use HTML which this mail box doens\'t support';

        $mail->send();
        echo 'Message has been sent';
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}
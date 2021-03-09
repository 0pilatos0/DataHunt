<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require "../env.php";
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

        $mail->setFrom('DatahuntRpg@gmail.com', 'Datahunt team');;
        $mail->addAddress($receiver, $person);

        $mail->isHTML(true);
        $mail->Subject = 'Thanks for joining us';
        $mail->Body = "We are happy to hear that you joined us. \n We hope you will enjoy your time spent on our game. \n Please verify your account by pressing the button below.<br> http://localhost/sites/DataHunt/Website/pages/verification.php/?veri=$veritoken";
        $mail->AltBody = 'Our mails use HTML which this mail box doens\'t support';

        $mail->send();
        echo 'Message has been sent';
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}
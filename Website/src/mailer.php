<?php

namespace Datahunt;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

/**
 * Class Mailer
 * @package Datahunt
 */
class Mailer
{
    /** @var PHPMailer $phpMailer */
    protected $phpMailer;

    /**
     * Mailer constructor.
     */
    public function __construct($host = 'smtp.gmail.com', $post = 587, $debug = false)
    {
        $this->phpMailer = new PHPMailer(true);

        // Zet debuggen alleen maar aan als we dat ook echt willen.
        if ($debug === true) {
            $this->phpMailer->SMTPDebug = SMTP::DEBUG_SERVER;
        }

        // Zet beveiligings opties voor de emailer.
        $this->phpMailer->isSMTP();
        $this->phpMailer->SMTPAuth = true;
        $this->phpMailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

        // Zet de login voor het gmail account.
        $this->phpMailer->Host = $host;
        $this->phpMailer->Port = 587;

        $this->phpMailer->Username = getenv("GMAILUSERNAME");
        $this->phpMailer->Password = getenv("GMAILPASSWORD");
    }

    /**
     * @param string $email
     * @param string $name
     * @return $this|false
     */
    public function setFrom($email = 'DatahuntRpg@gmail.com', $name = 'Datahunt team')
    {
        try {
            $this->phpMailer->setFrom($email, $name);
        } catch (\Exception $e) {
            $_SESSION['message'] = $e->getMessage();
            return false;
        }

        return $this;
    }

    public function addAddress($email, $name)
    {
        $this->phpMailer->addAddress($email, $name);
        return $this;
    }

    /**
     * @param bool $isHtml
     * @return $this
     */
    public function setIsHtml($isHtml = true)
    {
        $this->phpMailer->isHTML($isHtml);
        return $this;
    }

    /**
     * @param $subject
     * @return $this
     */
    public function setSubject($subject)
    {
        $this->phpMailer->Subject = $subject;
        return $this;
    }

    /**
     * @param $body
     * @return $this
     */
    public function setBody($body)
    {
        $this->phpMailer->Body = $body;
        return $this;
    }

    /**
     * @param $altBody
     * @return $this
     */
    public function setAltBody($altBody)
    {
        $this->phpMailer->AltBody = $altBody;
        return $this;
    }

    /**
     * @return bool
     */
    public function sendMail()
    {
        try {
            return $this->phpMailer->send();
        } catch (\Exception $e) {
            $_SESSION['message'] = $e->getMessage();
        }

        return false;
    }
}
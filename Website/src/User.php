<?php

namespace Datahunt;

/**
 * Class User
 * @package Datahunt
 */
class User extends Database
{
    /**
     * @return bool
     */
    public function login()
    {
        $username = $_POST['username'];
        $password = hash('sha512', $_POST['password']);
        $remember = (isset($_POST['remember']) && $_POST['remember'] === "on");

        $query = "SELECT * FROM `users` WHERE `username` = ? AND `password` = ? AND `enabled` = 1 AND `verified` = 1";
        $this->prepareStmt($query, function(&$stmt) use ($username, $password) {
            $stmt->bind_param('ss', $username, $password);
        });

        // gebruiker sessie aanmaken op basis van query resultaat
        $_SESSION['user'] = $this->getStmtRow();

        if ($remember === true) {
            $userId = $_SESSION['user']['id'];
            // Generate remember token
            $token = bin2hex(random_bytes(95));
            // Set token in database for user;
            $query = "UPDATE `users` SET `remember_token` = ? WHERE `id` = ?";
            $this->prepareStmt($query, function (&$stmt) use ($token, $userId) {
               $stmt->bind_param('si', $token, $userId);
            });
            // Set token in cookie
            if ($this->getAffectedRows() === 1) {
                setcookie('remember', $token, 60 * 60 * 24 * 365);
            }
        }

        // als inloggen gelukt is return true
        return (!empty($_SESSION['user']));
    }

    /**
     * @return bool
     */
    public function loginUserByToken()
    {
        $token = $_COOKIE['remember'] ?? false;
        if (!$token) {
            return false;
        }

        $query = "SELECT * FROM `users` WHERE `remember_token` = ?";
        $this->prepareStmt($query, function (&$stmt) use ($token) {
            $stmt->bind_param('s', $token);
        });

        // Als we geen gebruiker kunnen vinden met deze token return false.
        if ($this->getNumRows() !== 1) {
            return false;
        }

        // gebruiker sessie aanmaken op basis van query resultaat
        $_SESSION['user'] = $this->getStmtRow();

        return true;
    }

    /**
     * @return bool
     */
    public function logout()
    {
        if (isset($_COOKIE['remember'])) {
            unset($_COOKIE['remember']);
            setcookie('remember', null, -1, '/');
        }

        $_SESSION['user'] = null;
        unset($_SESSION['user']);
        return (!isset($_SESSION['user']));
    }

    /**
     * @TODO implement function
     */
    public function register()
    {

    }

    /**
     * @return bool
     */
    public function canResetPassword()
    {
        $email = $_GET['email'] ?? null;
        $token = $_GET['token'] ?? null;

        if (empty($email) || empty($token)) {
            $_SESSION['message'] = 'Email of token niet gevonden probeer het opnieuw.';
            header('location: index.php');
        }

        $query = "SELECT 1 FROM `password_resets` WHERE `email` = ? AND `token` = ?";
        $this->prepareStmt($query, function(&$stmt) use ($email, $token) {
            $stmt->bind_param('ss', $email, $token);
        });

        if ($this->getNumRows() !== 1) {
            $_SESSION['message'] = 'Er ging iets fout bij het resetten van je wachtwoord probeer het opnieuw';
            header('location: index.php');
        }

        return true;
    }

    /**
     * @throws \Exception
     */
    public function forgotPassword()
    {
        // Algemeen bericht als het formulier is ingevuld neerzetten.
        $_SESSION['message'] = 'Als het e-mail is gevonden zal je een mail krijgen om je wachtwoord opnieuw in te stellen.';
        $email = $_POST['email'];

        // query schrijven om in te loggen
        $query = "SELECT * FROM `users` WHERE `email` = ? AND `enabled` = 1 AND `verified` = 1";
        $this->prepareStmt($query, function (&$stmt) use ($email) {
            $stmt->bind_param('s', $email);
        });
        $user = $this->getStmtRow();

        // Als we een email gevonden hebben.
        if ($this->getNumRows() === 1) {
            // Random token maken voor wachtwoord reset.
            // 01001010100101010110001010101010 -> AF 1B E2 83 B3 97
            $token = bin2hex(random_bytes(95));

            // Stop het token in de database bij de email address.
            $query = "INSERT INTO `password_resets` (`email`, `token`) VALUES (?, ?)";
            $this->prepareStmt($query, function(&$stmt) use ($email, $token) {
                $stmt->bind_param('ss', $email, $token);
            });

            $path = $_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'];
            $parameters = [
                'page' => 'reset_password',
                'email' => $email,
                'token' => $token
            ];
            $url = $path . '?' . http_build_query($parameters);

            $message = "Om je wachtwoord te resetten klik op de volgende link: <a href=\" ${$url}\">Reset wachtwoord</a> <br />
                Als de link niet werkt kopieer de volgende link in je browser <br />
                ${url}";

            // Email versturen met password reset link.
            $mailer = new Mailer('smtp.gmail.com', 587, true);
            $mailer = $mailer->setIsHtml()
                ->setFrom()
                ->setSubject('Password reset')
                ->setBody($message)
                ->addAddress($email, $user['name'])
                ->sendMail();

            if (!$mailer) {
                $_SESSION['message'] = 'Er ging iets miss met het versturen van de e-mail';
            } else {
                $_SESSION['message'] = 'Er is een e-mail verzonden om je wachtwoord te kunnen herstellen';
            }
        }
    }

    /**
     *
     */
    public function resetPassword()
    {
        $password = $_POST['password'] ?? null;
        $confirmed = $_POST['password_confirmation'] ?? null;
        $email = $_POST['email'];

        if (empty($password) || empty($confirmed)) {
            $_SESSION['message'] = 'wachtwoord mag niet leeg zijn.';
            header('location: index.php?page=reset_password&email='.$_POST['email'].'&token='.$_POST['token']);
        }

        if ($password !== $confirmed) {
            $_SESSION['message'] = 'Wachtwoord en confirmatie komen niet overeen';
            header('location: index.php?page=reset_password&email='.$_POST['email'].'&token='.$_POST['token']);
        }

        $password = hash('sha512', $password);

        $query = "UPDATE `users` SET `password` = ? WHERE `email` = ?";
        $this->prepareStmt($query, function(&$stmt) use ($email, $password) {
            $stmt->bind_param('ss', $password, $email);
        });

        if ($this->getAffectedRows() !== 1) {
            $_SESSION['message'] = 'Er ging iets mis bij het opslaan van je wachtwoord.';
            header('location: index.php?page=reset_password&email='.$_POST['email'].'&token='.$_POST['token']);
        }

        $query = "DELETE FROM `password_resets` WHERE `email` = ? ";
        $this->prepareStmt($query, function (&$stmt) use ($email) {
           $stmt->bind_param('s', $email);
        });

        $_SESSION['message'] = 'Wachtwoord is bijgewerkt';
    }

    /**
     * @return bool
     */
    public function updateAccount()
    {
        $currentPassword         = $_POST['password-current'];
        $newPassword             = $_POST['password-new'];
        $newPasswordConfirmation = $_POST['password-new'];
        $name                    = $_POST['name'];
        $username                = $_POST['username'];
        $phone                   = $_POST['phone'];
        $email                   = $_POST['email'];
        $userId                  = $_SESSION['user']['id'];

        // Als het huidig wachtwoord niet is ingevuld mag je niet verder
        if (empty($currentPassword)) {
            $_SESSION['message'] = 'huidig wachtwoord mag niet leeg zijn';
            return false;
        }

        // Als het huidige wachtwoord wel is ingevuld dan moeten we kijken of die klopt
        $current = hash('sha512', $currentPassword);
        // Kijk of het huidige wachtwoord klopt.
        if ($current !== $_SESSION['user']['password']) {
            $_SESSION['message'] = 'Huidig wachtwoord is niet correct';
            return false;
        }


        // Kijk of we een nieuw wachtwoord willen instellen.
        if (!empty($newPassword)) {
            $passwordNew = hash('sha512', $newPassword);
            $passwordConfirmation = hash('sha512', $newPasswordConfirmation);
            // Zorg dat het nieuwe wachtwoord dubbel word ingevuld hetzelfde zodat we het kunnen controleren.
            if ($passwordNew !== $passwordConfirmation) {
                $_SESSION['message'] = 'Nieuw wachtwoord komt niet overeen';
                return false;
            }
        } else {
            $passwordNew = $current;
        }

        // Maak de query om de nieuwe gegevens weg te schrijven in de database.
        $query = "UPDATE `users` SET `name` = ?, `username` = ?, `password` = ?, `phone` = ?, `email` = ? WHERE `id` = ?; ";
        $this->prepareStmt($query, function (&$stmt) use($name , $username, $passwordNew, $phone, $email, $userId) {
            $stmt->bind_param('sssssi', $name, $username, $passwordNew, $phone, $email, $userId);
        });

        // Als de "affected rows" (bijgewerkte rijen) niet 1 is dan weten we dat het niet goed is gegaan.
        if ($this->getAffectedRows() !== 1) {
            $_SESSION['message'] = 'er ging iets mis bij het bijwerken van je account';
        } else {
            // doe het huidige account gegevens bijwerken met de nieuwe informatie.
            $_SESSION['user']['name'] = $_POST['name'];
            $_SESSION['user']['username'] = $_POST['username'];
            $_SESSION['user']['email'] = $_POST['email'];
            $_SESSION['user']['phone'] = $_POST['phone'];
            $_SESSION['user']['password'] = $passwordNew;

            $_SESSION['message'] = 'Account is bijgewerkt';
        }

        return true;
    }

    /**
     * @return bool
     */
    public function destroy()
    {
        $userId = $_SESSION['user']['id'];
        $query  = "DELETE FROM `users` WHERE `id` = ?";
        $this->prepareStmt($query, function (&$stmt) use ($userId) {
            $stmt->bind_param('i', $userId);
        });

        unset($_SESSION['user']);
        return true;
    }
}
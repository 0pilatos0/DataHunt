<?php

namespace Datahunt;

use Mysqli;
use mysqli_stmt;
use mysqli_result;

/**
 * Class Database
 * @package Datahunt
 */
class Database
{
    /** @var Mysqli $connection */
    protected $connection;
    /** @var mysqli_stmt|bool $stmt */
    protected $stmt;
    /** @var mysqli_result|bool $result */
    protected $result;

    /**
     * Database constructor.
     */
    public function __construct()
    {
        $this->connection = new mysqli(
            \getenv('MYSQLHOST'),
            \getenv('MYSQLUSERNAME'),
            \getenv('MYSQLPASSWORD'),
            \getenv('MYSQLDATABASE')
        );
    }

    /**
     * @return mysqli
     */
    public function getConnection()
    {
        return $this->connection;
    }

    /**
     * @return bool|mysqli_stmt
     */
    public function getStmt()
    {
        return $this->stmt;
    }

    /**
     * @return bool|mysqli_result
     */
    public function getResult()
    {
        if (!$this->result)
        {
            $this->result = $this->stmt->get_result();
        }

        return $this->result;
    }

    /**
     * @param string $query
     * @param \Closure $bind
     * @return bool
     */
    public function prepareStmt(string $query, \Closure $bind)
    {
        if ($this->stmt) {
            $this->closeStmt();
        }

        $this->stmt = $this->connection->prepare($query);
        $bind($this->stmt);
        $this->stmt->execute();

        return ($this->stmt->errno === 0);
    }

    /**
     * @return mixed
     */
    public function getStmtRow()
    {
        return $this->getResult()->fetch_assoc();
    }

    /**
     * @return int
     */
    public function getNumRows()
    {
        return $this->getResult()
            ? $this->getResult()->num_rows
            : 0;
    }

    /**
     * @return int
     */
    public function getAffectedRows()
    {
        return $this->stmt->affected_rows;
    }

    /**
     *
     */
    public function closeStmt()
    {
        if ($this->stmt) {
            $this->stmt->close();
            $this->stmt = null;
            unset($this->stmt);
        }
    }

    /**
     * Database destructor.
     */
    public function __destruct()
    {
        if ($this->stmt) {
            $this->closeStmt();
        }

        if ($this->result) {
            $this->result = null;
            unset($this->result);
        }

        if ($this->connection) {
            $this->connection->close();
            $this->connection = null;
            unset($this->connection);
        }
    }
}
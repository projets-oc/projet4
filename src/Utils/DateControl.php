<?php

namespace App\Utils;

class DateControl
{
    // Check if the date in the future, when the museum is open.
    /**
     * @param \DateTime $date
     * @return bool
     */
    public function isDateValid(\DateTime $date){
        date_default_timezone_set('Europe/Paris');
        $dayOfWeek = (int) $date->format('w');  // 0 for sunday -> 6 for saturday
        $dayOfMonth = (int) $date->format('j'); // 1 to 31
        $month = (int) $date->format('n'); // 1 to 12
        $year =(int) $date->format('Y'); // year
        $today = new \DateTime($date->format('Ymd'));
        $now = new \DateTime();
        $today->setTime( 0, 0, 0 );
        $now->setTime( 0, 0, 0 );

        $invalidDates = array(
            'today' => $today < $now,
            'tuesday' => $dayOfWeek === 2,
            'sunday' => $dayOfWeek === 0,
            'christmas' => (($dayOfMonth === 25) && ($month === 12)),
            'firstOfNovember' => (($dayOfMonth === 1) && ($month === 11)),
            'firstOfMay' => (($dayOfMonth === 1) && ($month === 5)),
        );

        $isDayValid = true;

        foreach($invalidDates as $invalidDate) {
            if ((bool) $invalidDate) 
                $isDayValid = false;
        }

        return $isDayValid;
    }

    /**
     * @param \DateTime $selectedDay
     * @return bool
     */
    public function allowFullDay(\DateTime $selectedDay) {
        date_default_timezone_set('Europe/Paris');

        $today = new \DateTime();
        $today->setTime( 0, 0, 0 );

        $selectedDay =new \DateTime($selectedDay->format('Ymd'));
        $selectedDay->setTime( 0, 0, 0 );

        $isToday = $today->getTimestamp() === $selectedDay->getTimestamp();

        if (!$isToday) return true;
        
        return (date('H') < 14);
    }
}
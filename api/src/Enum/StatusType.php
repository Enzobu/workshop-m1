<?php

namespace App\Enum;

enum StatusType: string
{
    case PENDING = 'pending';
    case IN_PROGRESS = 'in_progress';
    case FINISHED = 'finished';
}

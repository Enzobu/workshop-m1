<?php

namespace App\Enum;

enum GameStatusType: string
{
    case PENDING = 'pending';
    case IN_PROGRESS = 'in_progress';
    case FINISHED = 'finished';
}

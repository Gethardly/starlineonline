import { PartialType } from '@nestjs/mapped-types';
import { CreatePositionHistoryDto } from './create-position-history.dto';

export class UpdatePositionHistoryDto extends PartialType(CreatePositionHistoryDto) {}

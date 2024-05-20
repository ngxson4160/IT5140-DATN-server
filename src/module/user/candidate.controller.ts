import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { GetListCandidateDto } from './dto/get-list-candidate.dto';

@Controller('candidates')
export class CandidateController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getListCandidate(@Query() query: GetListCandidateDto) {
    return this.userService.getListCandidate(query);
  }

  @Get()
  getCandidateDetail() {}
}

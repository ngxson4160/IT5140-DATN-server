import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { UserData } from 'src/auth/decorator/user-data.decorator';
import { IUserData } from 'src/_core/type/user-data.type';
import { CreateBlogDto } from './dto/create-blog.dto';
import { Public } from 'src/auth/decorator/public.decorator';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { GetListBlogDto } from './dto/get-list-blog.dto';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  createBlog(@UserData() userData: IUserData, @Body() body: CreateBlogDto) {
    return this.blogService.createBlog(userData.id, body);
  }

  @Public()
  @Get('id')
  getDetail(@Param('id') id: number) {
    return this.blogService.getDetail(id);
  }

  @Public()
  getListBlog(@Query() query: GetListBlogDto) {
    return this.blogService.getListBlog(query);
  }

  @Delete('id')
  deleteBlog(@UserData() userData: IUserData, @Param('id') id: number) {
    return this.blogService.deleteBlog(userData.id, id);
  }

  @Put('id')
  updateBlog(
    @UserData() userData: IUserData,
    @Param('id') id: number,
    @Body() body: UpdateBlogDto,
  ) {
    return this.blogService.updateBlog(userData.id, id, body);
  }
}

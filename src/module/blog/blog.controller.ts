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
import { UpdateBlogDto } from './dto/update-blog.dto';
import { GetListBlogDto } from './dto/get-list-blog.dto';
import { FollowBlogDto } from './dto/follow-blog.dto';
import { PublicOrAuth } from 'src/_core/decorator/public-or-auth.decorator';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  createBlog(@UserData() userData: IUserData, @Body() body: CreateBlogDto) {
    return this.blogService.createBlog(userData.id, body);
  }

  @Post(':id/favorites')
  userFollowBlog(
    @UserData() userData: IUserData,
    @Param('id') id: string,
    @Body() body: FollowBlogDto,
  ) {
    return this.blogService.userFollowBlog(userData.id, +id, body);
  }

  @PublicOrAuth()
  @Get(':id')
  getDetail(@UserData() userData: IUserData, @Param('id') id: number) {
    return this.blogService.getDetail(id, userData?.id);
  }

  @PublicOrAuth()
  @Get()
  getListBlog(@UserData() userData: IUserData, @Query() query: GetListBlogDto) {
    return this.blogService.getListBlog(query, userData?.id);
  }

  @Delete(':id')
  deleteBlog(@UserData() userData: IUserData, @Param('id') id: number) {
    return this.blogService.deleteBlog(userData.id, id);
  }

  @Put(':id')
  updateBlog(
    @UserData() userData: IUserData,
    @Param('id') id: number,
    @Body() body: UpdateBlogDto,
  ) {
    return this.blogService.updateBlog(userData.id, id, body);
  }
}

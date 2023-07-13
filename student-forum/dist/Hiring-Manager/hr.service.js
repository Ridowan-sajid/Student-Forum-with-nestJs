"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HrService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const hiring_entity_1 = require("../Db/hiring.entity");
const typeorm_2 = require("typeorm");
const job_entity_1 = require("../Db/job.entity");
const bcrypt = require("bcrypt");
const post_entity_1 = require("../Db/post.entity");
const student_entity_1 = require("../Db/student.entity");
const offer_entity_1 = require("../Db/offer.entity");
const comment_entity_1 = require("../Db/comment.entity");
let HrService = exports.HrService = class HrService {
    async deleteHr(email) {
        const res = await this.hrRepo.delete({ email: email });
        if (res) {
            return res;
        }
        else {
            throw new common_1.NotFoundException({
                status: common_1.HttpStatus.NOT_FOUND,
                message: 'There is something wrong',
            });
        }
    }
    async getAllCandidate(id, email) {
        const res = await this.hrRepo.findOneBy({ email: email });
        if (res) {
            return await this.jobRepo.find({
                where: { id: id },
                relations: {
                    students: true,
                },
            });
        }
        else {
            throw new common_1.NotFoundException({
                status: common_1.HttpStatus.NOT_FOUND,
                message: 'There is something wrong',
            });
        }
    }
    async addLetter(id, data, email) {
        const res = await this.jobRepo.findOneBy({ id: id });
        const res2 = await this.hrRepo.findOneBy({ email: email });
        if (res && res2) {
            data.hr = res2.id;
            data.job = res.id;
            return await this.offerRepo.save(data);
        }
        else {
            throw new common_1.NotFoundException({
                status: common_1.HttpStatus.NOT_FOUND,
                message: 'There is something wrong',
            });
        }
    }
    async getAllPost(email) {
        const res = await this.postRepo.find();
        if (res) {
            return res;
        }
        else {
            throw new common_1.NotFoundException({
                status: common_1.HttpStatus.NOT_FOUND,
                message: 'There is something wrong',
            });
        }
    }
    async getAllJob(email) {
        const res = await this.hrRepo.findOneBy({
            email: email,
        });
        if (res) {
            const res2 = await this.jobRepo.find();
            return res2;
        }
        else {
            throw new common_1.NotFoundException({
                status: common_1.HttpStatus.NOT_FOUND,
                message: 'There is something wrong',
            });
        }
    }
    async getJobDetails(id, email) {
        const hr = await this.hrRepo.findOneBy({ email: email });
        if (hr) {
            const res = await this.jobRepo.findOneBy({ id: id });
            if (res) {
                return res;
            }
            else {
                throw new common_1.NotFoundException({
                    status: common_1.HttpStatus.NOT_FOUND,
                    message: 'Job Post Not Found',
                });
            }
        }
        else {
            throw new common_1.NotFoundException({
                status: common_1.HttpStatus.NOT_FOUND,
                message: 'There is something wrong',
            });
        }
    }
    constructor(hrRepo, jobRepo, postRepo, studentRepo, offerRepo, commentRepo) {
        this.hrRepo = hrRepo;
        this.jobRepo = jobRepo;
        this.postRepo = postRepo;
        this.studentRepo = studentRepo;
        this.offerRepo = offerRepo;
        this.commentRepo = commentRepo;
    }
    async deleteJob(id, email) {
        const hr = await this.hrRepo.findOneBy({ email: email });
        if (hr) {
            const res = await this.jobRepo.delete({ id: id, hr: hr.id });
            return res;
        }
        else {
            throw new common_1.NotFoundException({
                status: common_1.HttpStatus.NOT_FOUND,
                message: 'Not found the Job Post',
            });
        }
    }
    forgetpassword(id, data) {
        return '';
    }
    async passwordChange(data, email) {
        const hr = await this.hrRepo.findOneBy({
            email: email,
        });
        const isMatch = await bcrypt.compare(data.oldPassword, hr.password);
        if (isMatch) {
            const salt = await bcrypt.genSalt();
            hr.password = await bcrypt.hash(data.newPassword, salt);
            const res = await this.hrRepo.update(hr.id, hr);
            return res;
        }
        else {
            throw new common_1.NotFoundException({
                status: common_1.HttpStatus.NOT_FOUND,
                message: 'Not found the user',
            });
        }
    }
    deleteProfile(id) {
        return '';
    }
    async editProfile(data, email) {
        const res = await this.hrRepo.update({ email: email }, data);
        if (res) {
            return res;
        }
        else {
            throw new common_1.NotFoundException({
                status: common_1.HttpStatus.NOT_FOUND,
                message: 'User not found',
            });
        }
    }
    async myProfile(email) {
        const hr = await this.hrRepo.findOneBy({ email: email });
        if (hr) {
            return hr;
        }
        else {
            throw new common_1.NotFoundException({
                status: common_1.HttpStatus.NOT_FOUND,
                message: 'Not found the user',
            });
        }
    }
    dashboard() {
        return '';
    }
    async loginHr(hr) {
        const res = await this.hrRepo.findOneBy({ email: hr.email });
        if (res) {
            const isMatch = await bcrypt.compare(hr.password, res.password);
            if (isMatch)
                return isMatch;
        }
        else {
            return false;
        }
    }
    async addHr(hr) {
        const salt = await bcrypt.genSalt();
        hr.password = await bcrypt.hash(hr.password, salt);
        const res = await this.hrRepo.save(hr);
        if (res) {
            return res;
        }
        else {
            throw new common_1.InternalServerErrorException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'There is something wrong',
            });
        }
    }
    async addJob(data, email) {
        const hr = await this.hrRepo.findOneBy({ email: email });
        if (hr) {
            data.createdDate = new Date();
            data.updatedDate = new Date();
            data.hr = hr.id;
            console.log(data.hr);
            const res = await this.jobRepo.save(data);
            if (res) {
                return res;
            }
            else {
                throw new common_1.InternalServerErrorException({
                    status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'There is something wrong',
                });
            }
        }
    }
    async deleteJobByHrId(id, email) {
        const hr = await this.hrRepo.findOneBy({ email: email });
        return this.jobRepo.delete({ id: id, hr: hr.id });
    }
    async getJobByHrId(email) {
        const res = await this.hrRepo.find({
            where: { email: email },
            relations: {
                jobs: true,
            },
        });
        if (res) {
            return res;
        }
        else {
            throw new common_1.NotFoundException({
                status: common_1.HttpStatus.NOT_FOUND,
                message: 'There is something wrong',
            });
        }
    }
    async updateJob(id, data, email) {
        const hr = await this.hrRepo.findOneBy({ email: email });
        if (hr) {
            return this.jobRepo.update({ id: id, hr: hr.id }, data);
        }
        else {
            throw new common_1.NotFoundException({
                status: common_1.HttpStatus.NOT_FOUND,
                message: 'There is something wrong',
            });
        }
    }
    async addComment(id, data, email) {
        const hr = await this.hrRepo.findOneBy({ email: email });
        if (hr) {
            data.hr = hr.id;
            data.post = id;
            const res = await this.commentRepo.save(data);
            if (res) {
                return res;
            }
            else {
                throw new common_1.InternalServerErrorException({
                    status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'There is something wrong',
                });
            }
        }
    }
    async getPostComment(id, email) {
        const std = await this.hrRepo.findOneBy({ email: email });
        if (std) {
            const res = await this.postRepo.find({
                where: { id: id },
                relations: {
                    comments: { childComments: true },
                },
            });
            if (res) {
                return res;
            }
            else {
                throw new common_1.NotFoundException({
                    status: common_1.HttpStatus.NOT_FOUND,
                    message: 'There is something wrong',
                });
            }
        }
        else {
            throw new common_1.NotFoundException({
                status: common_1.HttpStatus.NOT_FOUND,
                message: 'There is something wrong',
            });
        }
    }
    async deleteComment(id, email) {
        const res = await this.hrRepo.findOneBy({ email: email });
        if (res) {
            const com = await this.commentRepo.delete(id);
            return com;
        }
        else {
            throw new common_1.NotFoundException({
                status: common_1.HttpStatus.NOT_FOUND,
                message: 'There is something wrong',
            });
        }
    }
    async addReplyComment(id, data, email) {
        const hr = await this.hrRepo.findOneBy({ email: email });
        if (hr) {
            data.hr = hr.id;
            data.parentComment = id;
            const res = await this.commentRepo.save(data);
            if (res) {
                return res;
            }
            else {
                throw new common_1.InternalServerErrorException({
                    status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'There is something wrong',
                });
            }
        }
    }
    async getReplyComment(id, email) {
        const hr = await this.hrRepo.findOneBy({ email: email });
        if (hr) {
            const res = await this.commentRepo.find({
                where: { id: id },
                relations: {
                    childComments: true,
                },
            });
            if (res) {
                return res;
            }
            else {
                throw new common_1.NotFoundException({
                    status: common_1.HttpStatus.NOT_FOUND,
                    message: 'There is something wrong',
                });
            }
        }
        else {
            throw new common_1.NotFoundException({
                status: common_1.HttpStatus.NOT_FOUND,
                message: 'You are not valided',
            });
        }
    }
    async getImages(res, email) {
        const admin = await this.hrRepo.findOneBy({ email: email });
        if (admin) {
            res.sendFile(admin.profileImg, { root: './uploads/hr' });
        }
        else {
            throw new common_1.NotFoundException({
                status: common_1.HttpStatus.NOT_FOUND,
                message: 'There is something wrong',
            });
        }
    }
};
__decorate([
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], HrService.prototype, "getImages", null);
exports.HrService = HrService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(hiring_entity_1.Hr)),
    __param(1, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __param(2, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __param(3, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(4, (0, typeorm_1.InjectRepository)(offer_entity_1.Offer)),
    __param(5, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], HrService);
//# sourceMappingURL=hr.service.js.map
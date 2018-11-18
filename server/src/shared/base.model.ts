import { SchemaOptions } from 'mongoose';
import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { prop, Typegoose, pre } from 'typegoose';

@pre<T>('findOneAndUpdate', function(next) {
  this._update.updatedAt = new Date(Date.now());
  next();
})
export class BaseModel<T> extends Typegoose {
  @prop({ default: Date.now() })
  createdAt?: Date;

  @prop({ default: Date.now() })
  updatedAt?: Date;

  id?: string;
}

export class BaseModelVm {
  @ApiModelPropertyOptional({ type: String, format: 'date-time' })
  createdAt?: Date;

  @ApiModelPropertyOptional({ type: String, format: 'date-time' })
  updatedAt?: Date;

  @ApiModelPropertyOptional()
  id?: string;
}

export const schemaOptions: SchemaOptions = {
  toJSON: {
    virtuals: true,
    getters: true,
  },
};

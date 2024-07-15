import Joi from "joi";

//Schema to get id from params
export const taskParamSchema=Joi.object(
    {
        id:Joi.number().optional().messages({
            "number.base": "id must be a number",
          })
    }
);

//Schema to create task
export const createTaskBodySchema=Joi.object(
    {
        name:Joi.string().required().messages(
            {
                "any.required":"Name is required",
            }
        )
    }
).options(
    {
        stripUnknown:true,
    }
);

//Schema to update task
export const updateTaskBodySchema=Joi.object(
    {
        name:Joi.string().required().messages(
            {
                "any.required":"Name is required",
            }
        )
    }
).options(
    {
        stripUnknown:true,
    }
);

//Schema to delete task
export const deleteTaskBodySchema=Joi.object(
    {
        task_id: Joi.string().required().messages({
            "number.base": "task ID must be a number",
          })
    }
).options(
    {
        stripUnknown:true,
    }
);

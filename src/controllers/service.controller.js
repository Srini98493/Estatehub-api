const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { servicesService } = require("../services");
const { sendEmail } = require("../services/emailService");
const createApplyLoanEmail = require("../templates/applyloan");
const config = require("../config/config");
const createServiceRequestEmail = require("../templates/services");

const createService = catchAsync(async (req, res) => {
  const serviceData = {
    ...req.body,
    createdBy: req.user.t_user_get_by_id[0]?.userid,
    updatedBy: req.user.t_user_get_by_id[0]?.userid,
  };
  const service = await servicesService.createService(serviceData);
  console.log(service, "Service Data");

  //Send email to admin
  if (service?.t_service_insert?.servicerequest !== "Apply for Home Loan") {
    await sendEmail({
      from: config.email.from,
      to: config.adminEmail,
      subject: "NRI Property Service Request Notification",
      text: "NRI Property Service Request Notification",
      html: createServiceRequestEmail(
        service?.t_service_insert?.requesterfullname,
        service?.t_service_insert?.requesteremail,
        service?.t_service_insert?.requestercontact,
        service?.t_service_insert?.requestdt,
        service?.t_service_insert?.servicerequest,
        config
      )
  });
  } else {
    await sendEmail({
      from: config.email.from,
      to: config.adminEmail,
      subject: "Bank Loan Service Request Notification",
      text: "Bank Loan Service Request Notification",
      html: createApplyLoanEmail(
        service?.t_service_insert?.requesterfullname,
        service?.t_service_insert?.requesteremail,
        service?.t_service_insert?.requestercontact,
        service?.t_service_insert?.requestdt
      )
  });
  }
  res.status(httpStatus.CREATED).send({
    status: "success",
    message: "Service created successfully",
    data: service,
  });
});

const updateService = catchAsync(async (req, res) => {
  const serviceData = {
    serviceId: req.params.id,
    ...req.body,
    updatedBy: req.user.t_user_get_by_id[0]?.userid,
  };
  const service = await servicesService.updateService(serviceData);
  res.send(service);
});

const getServiceById = catchAsync(async (req, res) => {
  const service = await servicesService.getServiceById(
    req.user.t_user_get_by_id[0]?.userid,
    req.query.serviceId || null,
    req.params.id || null
  );
  res.send(service);
});

const getAllHomeLoanServices = catchAsync(async (req, res) => {
  const services = await servicesService.getAllHomeLoanServices(
    req.user.t_user_get_by_id[0]?.userid,
    req.query.serviceId || null
  );

  res.send(services);
});

const getAllServices = catchAsync(async (req, res) => {
  const services = await servicesService.getAllServices();
  res.send(services);
});

const getAllServiceCategories = catchAsync(async (req, res) => {
  const result = await servicesService.getAllServiceCategories();
  res.status(httpStatus.OK).send(result);
});

const getAllHomeLoanCategories = catchAsync(async (req, res) => {
  const result = await servicesService.getAllHomeLoanCategories();
  res.status(httpStatus.OK).send(result);
});

module.exports = {
  createService,
  updateService,
  getServiceById,
  getAllServices,
  getAllServiceCategories,
  getAllHomeLoanCategories,
  getAllHomeLoanServices,
};

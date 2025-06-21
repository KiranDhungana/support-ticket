import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { logout, createTicket } from "../../services/api";
import { notifications } from "@mantine/notifications";

import { useEffect, useState } from "react";
import { DateTimePicker } from "@mantine/dates";
import dayjs from "dayjs";

const schema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  location: Yup.string().required("Location is required"),
  availableTime: Yup.string().required("Available time is required"),

  subject: Yup.string().required("Subject is required"),
  description: Yup.string().required("Description is required").min(10, "Description must be at least 10 characters"),
});

const UserDashboard = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [fromTime, setFromTime] = useState<string | null>(dayjs().toISOString());
  const [toTime, setToTime] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    try {
      const response = await createTicket(data);

      if (response.data.success) {
        notifications.show({
          title: "Ticket Created",
          message: "Your support ticket has been created successfully.",
          color: "green",
          position: "top-right",
        });

        reset();
      } else {
        notifications.show({
          title: "Creation Failed",
          message: response.data.message || "Failed to create ticket.",
          color: "red",
          position: "top-right",
        });
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Something went wrong. Please try again.",
        color: "red",
      });
      console.error("Ticket creation error:", error);
    }
  };
  useEffect(() => {
    if (fromTime && toTime) {
      const formattedInterval = `${dayjs(fromTime).format("YYYY-MM-DD HH:mm")} to ${dayjs(toTime).format(
        "YYYY-MM-DD HH:mm"
      )}`;
      setValue("availableTime", formattedInterval);
    }
  }, [fromTime, toTime, setValue]);
  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Create Ticket Here </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("name")} placeholder="Your Name" className="w-full p-2 border rounded mb-2" />
        {errors.name && <p className="text-red-500 mb-2">{errors.name.message}</p>}

        <input {...register("email")} placeholder="Your Email" className="w-full p-2 border rounded mb-2" />
        {errors.email && <p className="text-red-500 mb-2">{errors.email.message}</p>}

        <input {...register("phone")} placeholder="Phone Number" className="w-full p-2 border rounded mb-2" />
        {errors.phone && <p className="text-red-500 mb-2">{errors.phone.message}</p>}

        <input {...register("location")} placeholder="Location" className="w-full p-2 border rounded mb-2" />
        {errors.location && <p className="text-red-500 mb-2">{errors.location.message}</p>}

        <input type="hidden" {...register("availableTime")} />

        <div className="mb-2">
          <DateTimePicker
            label="From"
            value={fromTime}
            onChange={setFromTime}
            clearable
            valueFormat="YYYY-MM-DD HH:mm"
            required
          />

          <DateTimePicker label="To" value={toTime} onChange={setToTime} clearable required />
          {errors.availableTime && <p className="text-red-500 mt-1">{errors.availableTime.message}</p>}
        </div>
        <input {...register("subject")} placeholder="Subject" className="w-full p-2 border rounded mb-2" />
        {errors.subject && <p className="text-red-500 mb-2">{errors.subject.message}</p>}

        <textarea
          {...register("description")}
          placeholder="Describe your issue here..."
          className="w-full p-2 border rounded mb-2"
          rows={4}
        />
        {errors.description && <p className="text-red-500 mb-2">{errors.description.message}</p>}

        <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
          Submit Ticket
        </button>
      </form>
    </div>
  );
};

export default UserDashboard;

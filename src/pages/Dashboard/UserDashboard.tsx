import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { logout, createTicket } from "../../services/api";
import { notifications } from "@mantine/notifications";

import { useEffect, useState } from "react";
import { DateTimePicker } from "@mantine/dates";
import dayjs from "dayjs";
import { TextInput, Textarea, Button, Paper, Group, Text } from "@mantine/core";
import { IconTicket } from "@tabler/icons-react";

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
    <Paper className="p-6 max-w-lg mx-auto bg-white rounded shadow mt-8" withBorder shadow="md" radius="lg">
      <Group gap="sm" align="center" className="mb-6">
        <IconTicket size={28} className="text-blue-700" />
        <Text fw={700} size="xl">Create Ticket Here</Text>
      </Group>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextInput {...register("name")} label="Your Name" error={errors.name?.message} />
        <TextInput {...register("email")} label="Your Email" error={errors.email?.message} />
        <TextInput {...register("phone")} label="Phone Number" error={errors.phone?.message} />
        <TextInput {...register("location")} label="Location" error={errors.location?.message} />
        <input type="hidden" {...register("availableTime")} />
        <div>
          <label className="block text-sm font-medium mb-1">Available Time</label>
          <Group gap="md">
            <div className="flex-1">
              <DateTimePicker label="From" value={fromTime} onChange={setFromTime} clearable valueFormat="YYYY-MM-DD HH:mm" required />
            </div>
            <div className="flex-1">
              <DateTimePicker label="To" value={toTime} onChange={setToTime} clearable required />
            </div>
          </Group>
          {errors.availableTime && <p className="text-red-500 mt-1 text-xs">{errors.availableTime.message}</p>}
        </div>
        <TextInput {...register("subject")} label="Subject" error={errors.subject?.message} />
        <Textarea {...register("description")} label="Describe your issue here..." minRows={4} error={errors.description?.message} />
        <Button type="submit" color="blue" fullWidth mt="md">Submit Ticket</Button>
      </form>
    </Paper>
  );
};

export default UserDashboard;

import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Card,
  Input,
  Form,
  Typography,
  Modal,
  message,
  DatePicker,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  fetchEmployees,
  deleteEmployee,
  createEmployee,
  updateEmployee,
} from "@/store/slices/employeeSlice";
import type { AppDispatch } from "@/store/store";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UserOutlined,
  HomeOutlined,
  IdcardOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import type { DatePickerProps } from "antd";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  address: string;
  startDate: string;
  position: string;
  salary: number;
}

interface EmployeeFormData {
  id?: string;
  firstName: string;
  lastName: string;
  address: string;
  birthDate?: string;
  startDate?: string;
  position: string;
  salary: number;
  email: string;
  phone: string;
  department: string;
  status: string;
}

interface SearchFormValues {
  employeeId?: string;
  name?: string;
  startDate?: dayjs.Dayjs;
}

const EmployeeList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { employees, loading } = useSelector(
    (state: RootState) => state.employee
  );
  const [form] = Form.useForm();
  const [employeeForm] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleSearch = (values: SearchFormValues) => {
    console.log("Search values:", values);
  };

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

  const showModal = (record?: EmployeeFormData) => {
    setIsEditMode(!!record);
    if (record) {
      employeeForm.setFieldsValue(record);
    } else {
      employeeForm.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: EmployeeFormData) => {
    try {
      setIsSubmitting(true);
      const employeeData = {
        ...values,
        birthDate: values.birthDate
          ? dayjs(values.birthDate).format("YYYY-MM-DD")
          : undefined,
        startDate: values.startDate
          ? dayjs(values.startDate).format("YYYY-MM-DD")
          : undefined,
      };
      if (isEditMode) {
        await dispatch(
          updateEmployee({ id: values.id!, ...employeeData })
        ).unwrap();
        messageApi.success("อัพเดทข้อมูลพนักงานสำเร็จ");
      } else {
        await dispatch(createEmployee({ ...employeeData })).unwrap();
        messageApi.success("เพิ่มข้อมูลพนักงานสำเร็จ");
      }
      setIsModalOpen(false);
      employeeForm.resetFields();
      await dispatch(fetchEmployees()).unwrap();
    } catch {
      messageApi.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    employeeForm.resetFields();
  };

  const showDeleteConfirm = (id: string, name: string) => {
    Modal.confirm({
      title: "ยืนยันการลบข้อมูล",
      icon: <ExclamationCircleOutlined className="text-red-500" />,
      content: (
        <div>
          <p>คุณต้องการลบข้อมูลพนักงาน</p>
          <p className="font-semibold">{name}</p>
          <p>ใช่หรือไม่?</p>
        </div>
      ),
      okText: "ลบข้อมูล",
      cancelText: "ยกเลิก",
      okButtonProps: {
        danger: true,
      },
      onOk: async () => {
        try {
          await dispatch(deleteEmployee(id)).unwrap();
          messageApi.success("ลบข้อมูลพนักงานเรียบร้อยแล้ว");
          await dispatch(fetchEmployees()).unwrap();
        } catch {
          messageApi.error("เกิดข้อผิดพลาดในการลบข้อมูล");
        }
      },
    });
  };

  const handleEdit = (record: Employee) => {
    setIsEditMode(true);
    employeeForm.setFieldsValue({
      ...record,
      birthDate: dayjs(record.birthDate),
      startDate: dayjs(record.startDate),
    });
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "รหัสพนักงาน",
      dataIndex: "id",
      key: "id",
      width: "15%",
    },
    {
      title: "ชื่อพนักงาน",
      dataIndex: "firstName",
      key: "firstName",
      width: "20%",
    },
    {
      title: "ที่อยู่",
      dataIndex: "address",
      key: "address",
      width: "50%",
    },
    {
      title: "จัดการ",
      key: "action",
      width: "15%",
      render: (_: unknown, record: Employee) => (
        <div className="flex space-x-2">
          <Button
            type="text"
            icon={<EditOutlined className="text-blue-500" />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="text"
            icon={<DeleteOutlined className="text-red-500" />}
            onClick={() => showDeleteConfirm(record.id, record.firstName)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {contextHolder}
      <div className="max-w-[1000px] mx-auto">
        <Card className="mb-6 shadow-sm">
          <div className="mb-6">
            <Title level={2} className="!mb-0">
              ข้อมูลพนักงาน
            </Title>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSearch}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <Form.Item label="รหัสพนักงาน" name="employeeId">
              <Input placeholder="เลือกรหัสพนักงาน" className="w-full" />
            </Form.Item>

            <Form.Item label="ชื่อพนักงาน" name="name">
              <Input placeholder="ระบุชื่อพนักงาน" className="w-full" />
            </Form.Item>

            <Form.Item label="วันที่สมัคร" name="startDate">
              <DatePicker
                format={{
                  format: "YYYY-MM-DD HH:mm:ss",
                  type: "mask",
                }}
                onChange={onChange}
              />
            </Form.Item>

            <Form.Item className="md:col-span-3 flex justify-end mb-0">
              <Button
                type="primary"
                icon={<SearchOutlined />}
                className="w-32 h-10 rounded-lg bg-blue-500"
              >
                ค้นหา
              </Button>
            </Form.Item>
          </Form>
        </Card>
        <p className="text-white"></p>
        <Card className="mt-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Text type="secondary">ผลลัพธ์การค้นหา </Text>
              <Text strong className="text-lg">
                {" "}
                {employees.length}{" "}
              </Text>
              <Text type="secondary"> รายการ</Text>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
              className="h-10 rounded-lg bg-blue-500"
            >
              เพิ่มพนักงาน
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={employees as unknown as readonly Employee[]}
            loading={loading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showTotal: (total) => `ทั้งหมด ${total} รายการ`,
            }}
            className="border border-gray-200 rounded-lg"
          />
        </Card>

        <Modal
          title={
            <div className="flex items-center gap-2">
              <UserOutlined className="text-blue-600" />
              <span>
                {isEditMode ? "แก้ไขข้อมูลพนักงาน" : "เพิ่มข้อมูลพนักงาน"}
              </span>
            </div>
          }
          open={isModalOpen}
          onOk={() => {
            employeeForm
              .validateFields()
              .then((values) => handleSubmit(values))
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
          onCancel={handleModalCancel}
          width={600}
          okText={isEditMode ? "บันทึกการแก้ไข" : "เพิ่มพนักงาน"}
          cancelText="ยกเลิก"
          centered
          confirmLoading={isSubmitting}
          okButtonProps={{
            loading: isSubmitting,
          }}
        >
          <Form form={employeeForm} layout="vertical" className="mt-4">
            {isEditMode && (
              <Form.Item
                label={
                  <div className="flex items-center gap-2">
                    <IdcardOutlined /> รหัสพนักงาน
                  </div>
                }
                name="id"
              >
                <Input disabled className="bg-gray-50" />
              </Form.Item>
            )}

            <Form.Item
              label={
                <div className="flex items-center gap-2">
                  <UserOutlined /> ชื่อ
                </div>
              }
              name="firstName"
              rules={[
                { required: true, message: "กรุณากรอกชื่อ" },
                { min: 2, message: "ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร" },
              ]}
            >
              <Input placeholder="กรอกชื่อ" />
            </Form.Item>

            <Form.Item
              label={
                <div className="flex items-center gap-2">
                  <UserOutlined /> นามสกุล
                </div>
              }
              name="lastName"
              rules={[
                { required: true, message: "กรุณากรอกนามสกุล" },
                { min: 2, message: "นามสกุลต้องมีความยาวอย่างน้อย 2 ตัวอักษร" },
              ]}
            >
              <Input placeholder="กรอกนามสกุล" />
            </Form.Item>

            <Form.Item
              label={
                <div className="flex items-center gap-2">
                  <HomeOutlined /> ที่อยู่
                </div>
              }
              name="address"
              rules={[
                { required: true, message: "กรุณากรอกที่อยู่" },
                {
                  min: 10,
                  message: "ที่อยู่ต้องมีความยาวอย่างน้อย 10 ตัวอักษร",
                },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="กรอกที่อยู่"
                showCount
                maxLength={200}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default EmployeeList;

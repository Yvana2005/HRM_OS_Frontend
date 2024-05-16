import { Button, DatePicker, Form, Input, Modal, Select, Space } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { addSingleProjectTasks } from "../../../../redux/rtk/features/projectManagement/project/projectTask/projectTask";
import { useSelector } from "react-redux";
import {
	loadAllProject,
	loadSingleProject,
} from "../../../../redux/rtk/features/projectManagement/project/project/project";
import { loadAllTaskPriority } from "../../../../redux/rtk/features/projectManagement/project/taskPriority/taskPriority";
import {
	loadAllTaskStatus,
	loadAllTaskStatusByProjectId,
} from "../../../../redux/rtk/features/projectManagement/project/taskStatus/taskStatus";
import BigDrawer from "../../../Drawer/BigDrawer";
import AddTaskPriority from "../../../project/taskPriority/AddtaskPriority";
import AddMilestone from "../../../project/milestone/AddMilestone";
import {
	loadAllMilestone,
	loadAllMilestoneByProjectId,
} from "../../../../redux/rtk/features/projectManagement/project/milestone/milestone";
import AddProjectTeam from "../../../project/team/AddProjectTeam";
import { loadAllProjectTeamByProjectId } from "../../../../redux/rtk/features/projectManagement/project/projectTeam/projectTeam";

// import { loadSingleStaff } from "../../../redux/rtk/features/user/userSlice";
// import { addEducation } from "../../education/educationApis";

const TaskAddSinglePopup = ({ projectId, taskStatusId }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [form] = Form.useForm();
	const [startDate, setstartDate] = useState(null);
	const [endDate, setendDate] = useState(null);
	const [loader, setLoader] = useState(false);
	const { project } = useSelector((state) => state.project);
	const taskStatus = useSelector((state) => state.taskStatus.list);
	const taskPriority = useSelector((state) => state.taskPriority.list);
	const projectTeamList = useSelector((state) => state.projectTeam.list);
	const milestoneList = useSelector((state) => state.milestone.list);
	const [teamUserList, setTeamUserList] = useState([]);

	const { id } = useParams("id");

	console.log("milestone ", milestoneList);
	const dispatch = useDispatch();

	// useEffect(() => {
	// 	if (project) {
	// 		setProjectTeamList(project?.projectTeam);
	// 		console.log(project?.projectTeam);
	// 		setMilestoneList(project?.milestone);
	// 	}
	// }, [project]);

	useEffect(() => {
		dispatch(loadSingleProject(projectId));
		dispatch(loadAllMilestoneByProjectId(projectId));
		dispatch(loadAllProjectTeamByProjectId(projectId));
		dispatch(loadAllTaskPriority());
	}, []);

	const onFinish = async (values) => {
		setLoader(true);

		const infodata = {
			...values,
			taskStatusId: parseInt(taskStatusId),
			projectId: parseInt(projectId),
			completionTime: parseFloat(values.completionTime),
			startDate: dayjs(startDate).format("YYYY-MM-DD"),
			endDate: dayjs(endDate).format("YYYY-MM-DD"),
		};

		console.log("infodata", infodata);

		const resp = await dispatch(addSingleProjectTasks(infodata));

		if (resp.payload.message === "success") {
			setLoader(false);
			// dispatch(loadSingleStaff(user_id.id));
			setIsModalOpen(false);

			dispatch(loadAllTaskStatusByProjectId(projectId));
			form.resetFields();
		} else {
			setLoader(false);
		}
	};

	const onFinishFailed = (errorInfo) => {
		toast.warning("Failed at adding task");
		setLoader(false);
	};
	const showModal = () => {
		setIsModalOpen(true);
	};

	const handleCancel = () => {
		setstartDate(dayjs());

		setendDate(dayjs());
		setIsModalOpen(false);
		setLoader(false);

		form.resetFields();
	};

	return (
		<div>
			<div className='text-center'>
				<button
					className='flex items-center justify-center w-6 h-6 ml-auto text-indigo-500 rounded hover:bg-indigo-500 hover:text-indigo-100'
					type='primary'
					onClick={showModal}>
					<svg
						class='w-10 h-10'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							stroke-linecap='round'
							stroke-linejoin='round'
							stroke-width='2'
							d='M12 6v6m0 0v6m0-6h6m-6 0H6'></path>
					</svg>
				</button>
			</div>
			<Modal
				width={`50%`}
				title={`Add Task`}
				okButtonProps={{ style: { display: "none" } }}
				open={isModalOpen}
				onCancel={handleCancel}>
				<Form
					form={form}
					style={{ marginBottom: "20px" }}
					eventKey='department-form'
					name='basic'
					labelCol={{
						span: 6,
					}}
					wrapperCol={{
						span: 16,
					}}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
					autoComplete='off'>
					<div>
						<div className='flex justify-center'>
							{/* <Form.Item
								style={{ marginBottom: "10px" }}
								tooltip='Select Project'
								name='projectId'
								rules={[
									{
										required: true,
										message: "Please input your projectId!",
									},
								]}>
								<Select
									className='mr-2'
									placeholder='Select Project'
									mode='single'
									style={{ width: "150px" }}>
									{projectList.map((item) => (
										<Select.Option key={item.id} value={item.id}>
											{item.name}
										</Select.Option>
									))}
								</Select>
							</Form.Item> */}

							<div className='flex justify-around ml-5 mr-10'>
								<span className='font-semibold mr-2 mt-1'>Milestone :</span>
								<Form.Item style={{ marginBottom: "10px" }} name='milestoneId'>
									<Select
										className='mr-2'
										loading={milestoneList?.length === 0}
										placeholder='Selectionnez un jalon'
										mode='single'
										style={{ width: "160px" }}>
										{milestoneList.map((item) => (
											<Select.Option key={item.id} value={item.id}>
												{item.name}
											</Select.Option>
										))}
									</Select>
								</Form.Item>
								<BigDrawer
									children={
										<AddMilestone isFixed={true} projectId={projectId} />
									}
									title={"Add New Milestone"}
								/>
							</div>
							<div className='flex justify-start'>
								<span className='font-semibold mr-2 mt-1'>Priority :</span>
								<Form.Item
									style={{ marginBottom: "10px" }}
									name='priorityId'
									tooltip='Select Priority'
									rules={[
										{
											required: true,
											message: "Please input your priority!",
										},
									]}>
									<Select
										className='mr-2'
										placeholder='Sélectionnez la priorité'
										loading={taskPriority?.length === 0}
										mode='single'
										style={{ width: "160px" }}>
										{taskPriority?.map((item) => (
											<Select.Option key={item.id} value={item.id}>
												{item.name}
											</Select.Option>
										))}
									</Select>
								</Form.Item>
								<BigDrawer
									children={<AddTaskPriority />}
									title={"Add New Task Priority"}
								/>
							</div>

							{/* <Form.Item
								style={{ marginBottom: "10px" }}
								name='taskStatusId'
								tooltip='Select Task Status'
								rules={[
									{
										required: true,
										message: "Please input your taskStatus!",
									},
								]}>
								<Select
									className='mr-2'
									placeholder='Select Task Status'
									mode='single'
									style={{ width: "150px" }}>
									{taskStatus?.map((item) => (
										<Select.Option key={item.id} value={item.id}>
											{item.name}
										</Select.Option>
									))}
								</Select>
							</Form.Item> */}
						</div>

						<Form.Item
							style={{ marginBottom: "10px" }}
							label='Sélection d\équipe'
							name='teamSelect'>
							<div className='flex'>
								<Select
									className='mr-2'
									placeholder='Select Team'
									loading={projectTeamList?.length === 0}
									onChange={(value) => {
										projectTeamList.map((item) => {
											if (item.id === value) {
												// make object for setTeamUserList
												const projectTeamMember = item.projectTeamMember.map(
													(item) => {
														return {
															userId: item.userId,
															user: item.user,
														};
													}
												);
												setTeamUserList(projectTeamMember);
											}
										});
									}}
									mode='single'>
									{projectTeamList.map((item) => (
										<Select.Option key={item.id} value={item.id}>
											{item.projectTeamName}
										</Select.Option>
									))}
								</Select>
								<BigDrawer
									children={<AddProjectTeam projectId={projectId} />}
									projectId={projectId}
								/>
							</div>
						</Form.Item>

						<Form.Item
							style={{ marginBottom: "10px" }}
							label='Sélection des membres de l\équipe'
							rules={[
								{
									required: true,
									message: "Veuillez sélectionner une équipe !",
								},
							]}
							name='assignedTask'>
							<Select
								className='mr-2'
								placeholder='Select Member'
								loading={teamUserList?.length === 0}
								mode='multiple'
								optionFilterProp='children'>
								{teamUserList.map((item) => (
									<Select.Option key={item.userId} value={item.userId}>
										{item.user.firstName + " " + item.user.lastName}
									</Select.Option>
								))}
							</Select>
						</Form.Item>

						<Form.Item
							style={{ marginBottom: "10px" }}
							label='Nom de la tâche'
							rules={[
								{
									required: true,
									message: "Veuillez saisir le nom de la tâche !",
								},
							]}
							name='name'>
							<Input placeholder='nom de la tâche' />
						</Form.Item>

						<Form.Item
							style={{ marginBottom: "10px" }}
							label='Date de debut'
							name='startDate'
							valuePropName='startDate'
							rules={[
								{
									required: true,
									message: "Veuillez saisir votre date de début !",
								},
							]}>
							<DatePicker onChange={(date) => setstartDate(date)} />
						</Form.Item>

						<Form.Item
							style={{ marginBottom: "10px" }}
							label='Date de fin'
							rules={[
								{
									required: true,
									message: "Veuillez saisir votre date de fin!",
								},
							]}
							name='endDate'
							valuePropName='endDate'>
							<DatePicker onChange={(date) => setendDate(date)} />
						</Form.Item>

						<Form.Item
							style={{ marginBottom: "10px" }}
							label='Description'
							name='description'
							rules={[
								{
									required: true,
									message: "Veuillez saisir votre description !",
								},
							]}>
							<Input.TextArea placeholder='Description' />
						</Form.Item>

						<Form.Item
							style={{ marginBottom: "20px" }}
							label='Le temps d/achèvement'
							name='completionTime'
							required
							rules={[
								{
									required: true,
									message: "Veuillez saisir votre heure de réalisation !",
								},
							]}>
							<Input placeholder='20.00 in Hours' />
						</Form.Item>

						<Form.Item
							style={{ marginBottom: "20px" }}
							wrapperCol={{
								offset: 6,
								span: 16,
							}}>
							<Button
								block
								onClick={() => setLoader(true)}
								type='primary'
								size='middle'
								htmlType='submit'
								loading={loader}>
								Ajouter maintenant
							</Button>
						</Form.Item>
					</div>
				</Form>
			</Modal>
		</div>
	);
};
export default TaskAddSinglePopup;

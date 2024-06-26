import axios from "axios";
import { toast } from "react-toastify";

// Get Roles
export const getEducations = async () => {
	const { data } = await axios.get(`education?status=true&page=1&count=20`);

	return data;
};

// Create Role

export const addEducation = async (values) => {
	try {
		const { data } = await axios({
			method: "post",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json;charset=UTF-8",
			},
			url: `education`,
			data: {
				...values,
			},
		});
		//dispatching data
		toast.success("Ajout réussi");

		return {
			data,
			message: "success",
		};
	} catch (error) {
		toast.error("Erreur lors de l'ajout de l'Education, réessayer");
		console.log(error.message);
		return {
			message: "error",
		};
	}
};

// Detail Role View

export const loadSingleEducation = async (id) => {
	//dispatching with an call back function and returning that

	try {
		const { data } = await axios.get(`education/${id}`);
		return {
			data,
			message: "Success",
		};
		//dispatching data
	} catch (error) {
		console.log(error.message);
	}
};

// Update education

export const updateEducation = async (id, values) => {
	try {
		const { data } = await axios({
			method: "put",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json;charset=UTF-8",
			},
			url: `education/${id}`,
			data: {
				...values,
			},
		});
		//dispatching data
		toast.success("Mise à jour réussie");

		return {
			data,
			message: "success",
		};
	} catch (error) {
		toast.error("Erreur lors de la mise à jour de l'éducation, réessayez");
		console.log(error.message);

		return {
			message: "error",
		};
	}
};

// Delete education

export const deleteEducation = async (id) => {
	try {
		const { data } = await axios({
			method: "delete",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json;charset=UTF-8",
			},
			url: `education/${id}`,
		});
		//dispatching data
		toast.success("Supprimé avec succès");

		return {
			data,
			message: "success",
		};
	} catch (error) {
		toast.error("Erreur lors de la suppression de l'éducation, réessayez");
		console.log(error.message);
		return {
			message: "error",
		};
	}
};

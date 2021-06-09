import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import { Button, Header, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { v4 as uuid } from "uuid";

import { useStore } from "../../../app/stores/store";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";
import { Activity } from "../../../app/models/activity";

export default observer(function ActivityForm() {
  const { activityStore } = useStore();
  const {
    createActivity,
    updateActivity,
    loading,
    loadingInitial,
    loadActivity,
  } = activityStore;
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<Activity>({
    id: "",
    title: "",
    category: "",
    date: null,
    description: "",
    city: "",
    venue: "",
  });

  const validationSchema = Yup.object({
    title: Yup.string().required("Activity title is required"),
    description: Yup.string().required("Description is required"),
    category: Yup.string().required(),
    venue: Yup.string().required(),
    city: Yup.string().required(),
    date: Yup.string().required("Date is required").nullable(),
  });

  useEffect(() => {
    if (id) loadActivity(id).then((activity) => setActivity(activity!));
  }, [id, loadActivity]);

  function handleFormSubmit(activity: Activity) {
    if (activity.id.length === 0) {
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(newActivity).then(() =>
        history.push(`/activities/${newActivity.id}`)
      );
    } else {
      updateActivity(activity).then(() =>
        history.push(`/activities/${activity.id}`)
      );
    }
  }

  if (loadingInitial)
    return <LoadingComponent content="Loading activity..."></LoadingComponent>;
  return (
    <Segment clearing>
      <Header content="Activity Details" color="teal"></Header>
      <Formik
        validationSchema={validationSchema}
        enableReinitialize
        initialValues={activity}
        onSubmit={(values) => handleFormSubmit(values)}
      >
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <MyTextInput name="title" placeholder="Title"></MyTextInput>
            <MyTextArea
              placeholder="Description"
              name="description"
              rows={3}
            ></MyTextArea>
            <MySelectInput
              placeholder="Category"
              name="category"
              options={categoryOptions}
            ></MySelectInput>
            <MyDateInput
              placeholderText="Date"
              name="date"
              showTimeSelect
              timeCaption="time"
              dateFormat="MMM d, yyyy h:mm aa"
            ></MyDateInput>
            <Header content="Location Details" color="teal"></Header>
            <MyTextInput placeholder="City" name="city"></MyTextInput>
            <MyTextInput placeholder="Venue" name="venue"></MyTextInput>
            <Button
              disabled={isSubmitting || !isValid || !dirty}
              floated="right"
              positive
              type="submit"
              content="Submit"
              loading={loading}
            ></Button>
            <Button
              floated="right"
              type="submit"
              content="Cancel"
              as={Link}
              to="/activities"
            ></Button>
          </Form>
        )}
      </Formik>
    </Segment>
  );
});

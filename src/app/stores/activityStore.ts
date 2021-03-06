import { format } from "date-fns";
import {  makeAutoObservable, runInAction } from "mobx"
import agent from "../api/agent";
import { Activity } from "../models/activity";

export default class ActivityStore{
 
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this);
         //makeObservable(this)
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) =>
            a.date!.getTime() - b.date!.getTime());
    }

    get groupedActivities()
    {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) =>
            {
                const date = format(activity.date!, "dd MMM yyyy")
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities
            }, {}as {[key:string]:Activity[]})
        )
    }

    loadActivities = async () => {
        this.loadingInitial = true;
        try {
            debugger;
            const activities = await agent.Activities.list();
            runInAction(() => {
                  activities.forEach((activity) => {
                  this.setActivity(activity);
             //this.activities.push(activity);
                
      });
           this.loadingInitial = false;
            })
          
         }
        catch (error) {
            console.log(error);
            runInAction(() => {
                  this.loadingInitial = false;
            })
          
        }
    }

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id)
        if (activity)
        {
            this.selectedActivity = activity;
            return activity;
        }
        else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                  runInAction(() => {
                   this.selectedActivity = activity;
            })
               
                this.loadingInitial = false;
                return activity;
            }
            catch (error) {
                this.loadingInitial = false;
            }
        }
    }

    private setActivity = (activity: Activity) => {
          //activity.date = activity.date.split("T")[0];
        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    }
    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    //Since Router is implemented so below code is not required commenting.
    //selectActivity = (id: string) => {
       // this.selectedActivity = this.activities.find(a => a.id === id);
     //   this.selectedActivity = this.activityRegistry.get(id);
   // }

  //  cancelSelectedActivity = () => {
   //     this.selectedActivity = undefined;
   // }

   // openForm = (id?: string) => {
   //     id ? this.selectActivity(id) : this.cancelSelectedActivity();
   //     this.editMode = true;
   // }

   // closeForm = () => {
   //     this.editMode = false;
  //  }

    createActivity = async (activity: Activity) => {
        this.loading = true;
       
        try {
            await agent.Activities.create(activity);

            runInAction(() =>
            {
                //this.activities.push(activity);
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                 this.loading=false
            })
            
        }
        catch (error) {
             runInAction(() =>
            {
                
                 this.loading=false
            })
            
        }
        
    }

    updateActivity = async (activity:Activity) => {
        this.loading = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
               // this.activities = [...this.activities.filter(a => a.id !== activity.id), activity];
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
               
            })

        } catch (error) {
            runInAction(() => {
                
                this.loading = false;
               
            })
        }
    }

    deleteActivity = async (id: string) => {
        debugger;
        this.loading = true;
        try {

            await agent.Activities.delete(id);
            runInAction(() => {
                //this.activities = [...this.activities.filter(a => a.id !== id)];
                this.activityRegistry.delete(id);
                //Since Routing so below line is not required
               // if (this.selectedActivity?.id === id) this.cancelSelectedActivity();
                this.loading = false;
            })
        }
        catch (error) {runInAction(() => {
              
                this.loading = false;
            }) }

    }
}
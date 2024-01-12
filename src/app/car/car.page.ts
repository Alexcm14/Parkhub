import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { from, take, switchMap } from 'rxjs';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-car',
  templateUrl: './car.page.html',
  styleUrls: ['./car.page.scss'],
})
export class CarPage {
  plaque: string = '';
  marque: string = '';
  type: string ='';
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone: string;
  vehicles: any[] = [];
  selectedVehicle: any;
  ajoutVehiculeClicked: boolean = false

  constructor(private authService: AuthService, private firestore: AngularFirestore, private toastController: ToastController) {}

  ngOnInit() {
    // Fetch logged-in user data
    this.authService.getLoggedInUserObservable().pipe(
      switchMap((userData) => {
        console.log('Raw userData:', userData);

        if (userData) {
          const userId = this.authService.uid || userData['uid']; // Access the UID property

          console.log('User ID:', userId);

          // Retrieve additional data from Firestore
          return this.firestore.collection('user_data').doc(userId).valueChanges();
        } else {
          console.log('User is not logged in');
          return from([]); // Empty observable
        }
      }),
      take(1)
    ).subscribe((additionalData: any) => {
      console.log('Processed additionalData:', additionalData);

      if (additionalData) {
        this.nom = additionalData.nom;
        this.prenom = additionalData.prenom;
        this.telephone = additionalData.telephone;

        // Load car data
        this.loadCarData();
      } else {
        console.log('User data not found in Firestore.');
      }
    });
  }

  validatePlate(plate: string): boolean {
    const platePattern = /^\d-[A-Za-z]{3}-\d{3}$/;
    return platePattern.test(plate);
  }
  

  loadCarData() {
    // Retrieve data from the 'car_data' collection
    this.firestore.collection('user_data').doc(this.authService.uid).collection('car_data').valueChanges().subscribe((carData: any) => {
      if (carData) {
        console.log('Car Data:', carData);
        // Update the list of vehicles
        this.vehicles = carData;
      }
    });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Données enregistrées',
      duration: 2500,
      color: 'primary'
    });
    toast.present();
  }

  ajouterVehicule() {
    if (this.plaque && this.marque && this.type) {
      // Get the user observable
      const userObservable = this.authService.getLoggedInUserObservable();
  
      // Get user data
      userObservable.pipe(take(1)).subscribe((userData) => {
        if (userData) {
          const userId = this.authService.uid || userData['uid'];
  
          console.log('User ID:', userId);
  
          if (userId) {
            const user = {
              marque: this.marque,
              plaque: this.plaque,
              type: this.type,
            };
  
            // Generate a unique identifier for the vehicle (e.g., using a UUID library)
            const vehicleId = this.generateUniqueId();
  
            // Add the unique identifier to the vehicle data
            user['id'] = vehicleId;
  
            // Create a new collection for each vehicle
            const userDocRef = this.firestore.collection('user_data').doc(userId).collection('car_data').doc(vehicleId);
  
            // Add vehicle data to the collection
            userDocRef.set(user)
              .then(() => {
                console.log('Vehicle added to Firestore successfully!');
                // Clear the input fields
                this.plaque = '';
                this.marque = '';
                this.type='';
                // Set ajoutVehiculeClicked to true
                this.ajoutVehiculeClicked = true;
                // Load car data after adding
                this.loadCarData();
                this.presentToast();
              })
              .catch((error) => {
                console.error('Error adding vehicle to Firestore: ', error);
              });
          }
        }
      });
    }
  }

  
  // Generate a unique identifier (you may need to use a library for this)
  generateUniqueId(): string {
    // You can use a library like 'uuid' to generate a unique ID
    // Example: import { v4 as uuidv4 } from 'uuid';
    // return uuidv4();
    // For simplicity, you can use a timestamp-based ID
    return new Date().getTime().toString();
  }
  
  
  
  
  

  deleteVehicule(vehicle: any) {
    console.log('Deleting vehicle:', vehicle); // Log the vehicle object
    if (vehicle && vehicle.id) {
      // Find the index of the vehicle in the local array
      const index = this.vehicles.indexOf(vehicle);

      if (index !== -1) {
        // Remove the vehicle from the local array
        this.vehicles.splice(index, 1);

        // Update the local array
        this.vehicles = [...this.vehicles];

        // Delete the vehicle data from Firestore
        this.deleteVehicleFromFirestore(vehicle);
      }
    }
  }

  deleteVehicleFromFirestore(vehicle: any) {
    console.log('Deleting vehicle from Firestore. Vehicle ID:', vehicle.id);
    if (vehicle && vehicle.id) {
      // Get the user's ID (you may need to modify this depending on your authentication setup)
      const userId = this.authService.uid;

      if (userId) {
        // Construct the Firestore path to the vehicle data
        const vehiclePath = `user_data/${userId}/car_data/${vehicle.id}`;

        // Delete the vehicle data from Firestore
        this.firestore.doc(vehiclePath).delete()
          .then(() => {
            console.log('Vehicle deleted from Firestore successfully!');
          })
          .catch((error) => {
            console.error('Error deleting vehicle from Firestore: ', error);
          });
      }
    }
  }
}

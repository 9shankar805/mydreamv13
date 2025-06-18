// Test script to verify admin password change functionality
import fetch from 'node-fetch';

async function testPasswordChange() {
  const baseURL = 'http://localhost:5000';

  try {
    console.log('🔐 Testing Admin Password Change Functionality...\n');

    // Step 1: Login as admin to get session
    console.log('1. Logging in as admin...');
    const loginResponse = await fetch(`${baseURL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@sirahbazaar.com',
        password: 'admin123'
      })
    });

    const loginResult = await loginResponse.json();
    console.log('Login response status:', loginResponse.status);
    console.log('Login response:', loginResult);

    if (!loginResponse.ok || !loginResult.admin) {
      console.log('❌ Admin login failed - checking if admin exists...');

      // Check if this is a database issue
      if (loginResult.error && loginResult.error.includes('relation "admins" does not exist')) {
        console.log('💡 Database migration issue detected. The admins table does not exist.');
        console.log('🔧 Please run the database migrations first or restart the server to auto-create the admin.');
        return;
      }

      console.log('📝 Make sure the default admin exists. Attempting to create...');
      return;
    }

    const adminId = loginResult.admin.id;
    console.log('✅ Admin login successful, ID:', adminId);

    // Step 2: Test password change with correct current password
    console.log('\n2. Testing password change with correct current password...');
    const changePasswordResponse = await fetch(`${baseURL}/api/admin/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        adminId: adminId,
        currentPassword: 'admin123',
        newPassword: 'newadmin456'
      })
    });

    const changeResult = await changePasswordResponse.json();
    console.log('Password change response status:', changePasswordResponse.status);
    console.log('Password change response:', changeResult);

    if (changePasswordResponse.ok && changeResult.success) {
      console.log('✅ Password change successful!');

      // Step 3: Test login with new password
      console.log('\n3. Testing login with new password...');
      const newLoginResponse = await fetch(`${baseURL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@sirahbazaar.com',
          password: 'newadmin456'
        })
      });

      const newLoginResult = await newLoginResponse.json();
      console.log('New login response status:', newLoginResponse.status);

      if (newLoginResponse.ok && newLoginResult.admin) {
        console.log('✅ Login with new password successful!');

        // Step 4: Change password back to original
        console.log('\n4. Changing password back to original...');
        const revertResponse = await fetch(`${baseURL}/api/admin/change-password`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            adminId: adminId,
            currentPassword: 'newadmin456',
            newPassword: 'admin123'
          })
        });

        const revertResult = await revertResponse.json();
        console.log('Revert response status:', revertResponse.status);

        if (revertResponse.ok && revertResult.success) {
          console.log('✅ Password reverted to original successfully!');
        } else {
          console.log('❌ Failed to revert password:', revertResult);
        }
      } else {
        console.log('❌ Login with new password failed:', newLoginResult);
      }
    } else {
      console.log('❌ Password change failed:', changeResult);
    }

    // Step 5: Test password change with wrong current password
    console.log('\n5. Testing password change with wrong current password...');
    const wrongPasswordResponse = await fetch(`${baseURL}/api/admin/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        adminId: adminId,
        currentPassword: 'wrongpassword',
        newPassword: 'shouldnotwork'
      })
    });

    const wrongPasswordResult = await wrongPasswordResponse.json();
    console.log('Wrong password response status:', wrongPasswordResponse.status);

    if (!wrongPasswordResponse.ok && wrongPasswordResult.error) {
      console.log('✅ Correctly rejected wrong current password:', wrongPasswordResult.error);
    } else {
      console.log('❌ Should have rejected wrong current password');
    }

    // Step 6: Final verification with original password
    console.log('\n6. Final verification - login with original password...');
    const finalLoginResponse = await fetch(`${baseURL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@sirahbazaar.com',
        password: 'admin123'
      })
    });

    const finalLoginResult = await finalLoginResponse.json();
    if (finalLoginResponse.ok && finalLoginResult.admin) {
      console.log('✅ Final verification successful - original password restored');
    } else {
      console.log('❌ Final verification failed - original password may not be restored');
    }

    console.log('\n🎉 Password change testing completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Add a small delay to ensure server is ready
setTimeout(() => {
  testPasswordChange();
}, 2000);
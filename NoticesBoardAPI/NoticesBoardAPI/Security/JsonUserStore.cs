using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace NoticesBoardAPI.Security
{
    public class JsonUserStore : IUserStore<IdentityUser>, IUserPasswordStore<IdentityUser>, IUserEmailStore<IdentityUser>
    {
        private const string FileName = "users.json"; // Define where you want to store the JSON
        private readonly string _jsonUsersFilePath;
        private readonly PasswordHasher<IdentityUser> passwordHasher = new PasswordHasher<IdentityUser>(); // Password hasher instance

        public JsonUserStore()
        {
            _jsonUsersFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", FileName);

        }
        // Helper method to read the users from the JSON file asynchronously
        private async Task<List<IdentityUser>> GetUsersAsync()
        {
            if (!File.Exists(_jsonUsersFilePath))
            {
                return new List<IdentityUser>();
            }

            var json = await File.ReadAllTextAsync(_jsonUsersFilePath);
            return JsonConvert.DeserializeObject<List<IdentityUser>>(json) ?? new List<IdentityUser>();
        }

        // Helper method to write users to the JSON file asynchronously
        private async Task SaveUsersAsync(List<IdentityUser> users)
        {
            var json = JsonConvert.SerializeObject(users, Formatting.Indented);
            await File.WriteAllTextAsync(_jsonUsersFilePath, json);
        }

        // CreateAsync is used to create a new user, hash the password before storing
        public async Task<IdentityResult> CreateAsync(IdentityUser user, CancellationToken cancellationToken)
        {
            // Check if the email already exists
            var existingUser = (await GetUsersAsync()).FirstOrDefault(u => u.Email == user.Email);
            if (existingUser != null)
            {
                // If email already exists, return a failure result
                return IdentityResult.Failed(new IdentityError
                {
                    Description = "Email is already taken"
                });
            }

            // Hash the password before saving the user
            //user.PasswordHash = passwordHasher.HashPassword(user, user.PasswordHash);

            var users = await GetUsersAsync();
            users.Add(user);
            await SaveUsersAsync(users);
            return IdentityResult.Success;
        }

        // UpdateAsync to modify an existing user
        public async Task<IdentityResult> UpdateAsync(IdentityUser user, CancellationToken cancellationToken)
        {
            var users = await GetUsersAsync();
            var existingUser = users.FirstOrDefault(u => u.Id == user.Id);
            if (existingUser != null)
            {
                users.Remove(existingUser);
                users.Add(user);
                await SaveUsersAsync(users);
            }
            return IdentityResult.Success;
        }

        // DeleteAsync removes a user
        public async Task<IdentityResult> DeleteAsync(IdentityUser user, CancellationToken cancellationToken)
        {
            var users = await GetUsersAsync();
            var existingUser = users.FirstOrDefault(u => u.Id == user.Id);
            if (existingUser != null)
            {
                users.Remove(existingUser);
                await SaveUsersAsync(users);
            }
            return IdentityResult.Success;
        }

        // FindByIdAsync finds a user by their ID
        public async Task<IdentityUser> FindByIdAsync(string userId, CancellationToken cancellationToken)
        {
            var users = await GetUsersAsync();
            return users.FirstOrDefault(u => u.Id == userId);
        }

        // FindByNameAsync finds a user by their username
        public async Task<IdentityUser> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
        {
            var users = await GetUsersAsync();
            return users.FirstOrDefault(u => u.UserName == normalizedUserName);
        }

        // GetUserIdAsync returns the user ID
        public async Task<string> GetUserIdAsync(IdentityUser user, CancellationToken cancellationToken)
        {
            return await Task.FromResult(user.Id);
        }

        // GetUserNameAsync returns the user name
        public async Task<string> GetUserNameAsync(IdentityUser user, CancellationToken cancellationToken)
        {
            return await Task.FromResult(user.UserName);
        }

        // SetUserNameAsync sets the user name
        public async Task SetUserNameAsync(IdentityUser user, string userName, CancellationToken cancellationToken)
        {
            user.UserName = userName;
            await Task.CompletedTask;
        }

        // GetNormalizedUserNameAsync returns the normalized username
        public async Task<string> GetNormalizedUserNameAsync(IdentityUser user, CancellationToken cancellationToken)
        {
            return await Task.FromResult(user.UserName.ToUpper());
        }

        // SetNormalizedUserNameAsync sets the normalized username
        public async Task SetNormalizedUserNameAsync(IdentityUser user, string normalizedName, CancellationToken cancellationToken)
        {
            user.UserName = normalizedName.ToLower();
            await Task.CompletedTask;
        }

        // Password-related methods
        // SetPasswordHashAsync sets the hashed password
        public async Task SetPasswordHashAsync(IdentityUser user, string passwordHash, CancellationToken cancellationToken)
        {
            user.PasswordHash = passwordHash;
            await Task.CompletedTask;
        }

        // GetPasswordHashAsync gets the hashed password
        public async Task<string> GetPasswordHashAsync(IdentityUser user, CancellationToken cancellationToken)
        {
            return await Task.FromResult(user.PasswordHash);
        }

        // HasPasswordAsync checks if the user has a password
        public async Task<bool> HasPasswordAsync(IdentityUser user, CancellationToken cancellationToken)
        {
            return await Task.FromResult(!string.IsNullOrEmpty(user.PasswordHash));
        }

        // FindByEmailAsync finds a user by their email
        public async Task<IdentityUser> FindByEmailAsync(string normalizedEmail, CancellationToken cancellationToken)
        {
            var users = await GetUsersAsync();
            return users.FirstOrDefault(u => u.Email == normalizedEmail);
        }

        // SetEmailAsync sets the user's email
        public async Task SetEmailAsync(IdentityUser user, string email, CancellationToken cancellationToken)
        {
            user.Email = email;
            await Task.CompletedTask;
        }

        // GetEmailAsync gets the user's email
        public async Task<string> GetEmailAsync(IdentityUser user, CancellationToken cancellationToken)
        {
            return await Task.FromResult(user.Email);
        }

        // SetNormalizedEmailAsync sets the normalized email
        public async Task SetNormalizedEmailAsync(IdentityUser user, string normalizedEmail, CancellationToken cancellationToken)
        {
            user.Email = normalizedEmail;
            await Task.CompletedTask;
        }

        // Dispose method
        public void Dispose()
        {
            // No resources to dispose
        }


        public Task<bool> GetEmailConfirmedAsync(IdentityUser user, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task SetEmailConfirmedAsync(IdentityUser user, bool confirmed, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<string> GetNormalizedEmailAsync(IdentityUser user, CancellationToken cancellationToken)
            => Task.FromResult(user.Email.ToUpper());

    }
}

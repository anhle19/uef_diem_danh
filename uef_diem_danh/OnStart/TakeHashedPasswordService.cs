namespace uef_diem_danh.OnStart
{
    public class TakeHashedPasswordService : IHostedService
    {
        private readonly IServiceProvider _serviceProvider;

        public TakeHashedPasswordService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            using var scope = _serviceProvider.CreateScope();
            var generator = scope.ServiceProvider.GetRequiredService<TakeHashedPasswordRunner>();
            await generator.ExecuteGeneration();
        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    }
}

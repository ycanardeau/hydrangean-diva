using StronglyTypedIds;

namespace HydrangeanDiva.MediaPlayer.Domain.Playlists.ValueObjects;

[StronglyTypedId(Template.String)]
internal readonly partial struct PlaylistName
{
	public const int MaxLength = 255;
}
